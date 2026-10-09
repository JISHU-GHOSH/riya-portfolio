import cv2
import mediapipe as mp
import numpy as np
import os

FRAMES_DIR = "portfolio-hero/public/frames"
NUM_FRAMES = 64

# Color palette: Traditional rich velvet crimson maroon
# Edge: #82081d (BGR: 29, 8, 130) -> Center: #9a1028 (BGR: 40, 16, 154)
BASE_RADIUS = 8

mp_face_mesh = mp.solutions.face_mesh
raw_points = []

print("Phase 1: Tracking 3D facial landmarks across all frames...")

with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.2) as face_mesh:
    for i in range(NUM_FRAMES):
        path = os.path.join(FRAMES_DIR, f"{i:03d}.webp")
        img = cv2.imread(path)
        h, w = img.shape[:2]
        res = face_mesh.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        if not res.multi_face_landmarks:
            print(f"Warning: frame {i} failed landmark detection")
            continue
        lms = res.multi_face_landmarks[0].landmark
        p9 = lms[9]
        p8 = lms[8]
        p10 = lms[10]
        p152 = lms[152]
        p234 = lms[234]
        p454 = lms[454]
        
        # Exact sweet spot between eyebrows: 0.25 * p9 + 0.75 * p8
        bx = (p9.x * 0.25 + p8.x * 0.75) * w
        by = (p9.y * 0.25 + p8.y * 0.75) * h
        
        # Head roll angle
        dx_roll = (p152.x - p10.x) * w
        dy_roll = (p152.y - p10.y) * h
        roll = np.degrees(np.arctan2(dx_roll, dy_roll))
        
        # Yaw foreshortening ratio
        dist_left = abs(p454.x - p9.x)
        dist_right = abs(p9.x - p234.x)
        total_w = dist_left + dist_right
        yaw_ratio = min(dist_left, dist_right) / (total_w * 0.5) if total_w > 0 else 1.0
        
        raw_points.append({
            'idx': i,
            'path': path,
            'img': img,
            'bx': bx,
            'by': by,
            'roll': roll,
            'scale_x': max(0.45, min(1.0, yaw_ratio))
        })

print(f"Phase 2: Cyclically smoothing 64 circular trajectory frames...")

# Cyclic smoothing on circular trajectory
def smooth_cyclic(values, window=3):
    n = len(values)
    smoothed = []
    for i in range(n):
        # Weighted average of neighbors
        val = 0.5 * values[i] + 0.25 * values[(i - 1) % n] + 0.25 * values[(i + 1) % n]
        smoothed.append(val)
    return smoothed

bxs = smooth_cyclic([p['bx'] for p in raw_points])
bys = smooth_cyclic([p['by'] for p in raw_points])
rolls = smooth_cyclic([p['roll'] for p in raw_points])
scales = smooth_cyclic([p['scale_x'] for p in raw_points])

for i, p in enumerate(raw_points):
    p['bx'] = bxs[i]
    p['by'] = bys[i]
    p['roll'] = rolls[i]
    p['scale_x'] = scales[i]

def render_bindi(img, bx, by, roll, scale_x):
    h, w = img.shape[:2]
    radius = BASE_RADIUS
    rx = max(4, int(radius * scale_x))
    ry = radius
    
    patch_size = radius * 4
    x1 = max(0, int(bx) - patch_size)
    y1 = max(0, int(by) - patch_size)
    x2 = min(w, int(bx) + patch_size)
    y2 = min(h, int(by) + patch_size)
    
    patch = img[y1:y2, x1:x2].copy()
    ph, pw = patch.shape[:2]
    pcx = int(bx) - x1
    pcy = int(by) - y1
    
    overlay = patch.copy()
    
    for step in range(ry, 0, -1):
        frac = step / ry
        curr_rx = max(1, int(rx * frac))
        curr_ry = step
        b = int(24 + 14 * (1 - frac))
        g = int(6 + 10 * (1 - frac))
        r = int(122 + 30 * (1 - frac))
        cv2.ellipse(overlay, (pcx, pcy), (curr_rx, curr_ry), -roll, 0, 360, (b, g, r), -1, cv2.LINE_AA)
        
    mask = np.zeros((ph, pw), dtype=np.uint8)
    cv2.ellipse(mask, (pcx, pcy), (rx + 1, ry + 1), -roll, 0, 360, 255, -1, cv2.LINE_AA)
    mask_blur = cv2.GaussianBlur(mask, (3, 3), 0.6) / 255.0
    
    blended = (overlay * mask_blur[:, :, None] + patch * (1.0 - mask_blur[:, :, None])).astype(np.uint8)
    out = img.copy()
    out[y1:y2, x1:x2] = blended
    return out

print("Phase 3: Rendering bindi on all 64 directional frames...")
for p in raw_points:
    final_img = render_bindi(p['img'], p['bx'], p['by'], p['roll'], p['scale_x'])
    cv2.imwrite(p['path'], final_img, [cv2.IMWRITE_WEBP_QUALITY, 92])

print("Phase 4: Rendering bindi on center eye-contact frame...")
center_path = os.path.join(FRAMES_DIR, "center.webp")
center_img = cv2.imread(center_path)
h, w = center_img.shape[:2]

with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True) as face_mesh:
    res = face_mesh.process(cv2.cvtColor(center_img, cv2.COLOR_BGR2RGB))
    lms = res.multi_face_landmarks[0].landmark
    p9 = lms[9]
    p8 = lms[8]
    p10 = lms[10]
    p152 = lms[152]
    p234 = lms[234]
    p454 = lms[454]
    
    bx = (p9.x * 0.25 + p8.x * 0.75) * w
    by = (p9.y * 0.25 + p8.y * 0.75) * h
    dx_roll = (p152.x - p10.x) * w
    dy_roll = (p152.y - p10.y) * h
    roll = np.degrees(np.arctan2(dx_roll, dy_roll))
    
    final_center = render_bindi(center_img, bx, by, roll, 0.98)
    cv2.imwrite(center_path, final_center, [cv2.IMWRITE_WEBP_QUALITY, 92])

print("Completed successfully! All 65 WebP frames now have the bindi.")
