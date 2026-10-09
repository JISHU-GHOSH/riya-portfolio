import cv2
import mediapipe as mp
import numpy as np
import os
import sys

VIDEO_PATH = r"C:\porfolio_riya\Woman_moving_head_and_eyes_20261008162542.mp4"
OUT_DIR = r"portfolio-hero/public/frames"
os.makedirs(OUT_DIR, exist_ok=True)

# 64-frame counter-clockwise continuous circular mapping for Riya:
frame_map = [
    # 0..7: 0° to 45° (RIGHT -> UP-RIGHT)
    146, 147, 148, 149, 150, 151, 152, 153,
    # 8..15: 45° to 90° (UP-RIGHT -> UP)
    154, 155, 156, 157, 158, 159, 160, 161,
    # 16..23: 90° to 135° (UP -> UP-LEFT)
    30, 36, 42, 48, 54, 58, 62, 66,
    # 24..31: 135° to 180° (UP-LEFT -> LEFT)
    68, 70, 72, 74, 76, 78, 80, 82,
    # 32..39: 180° to 225° (LEFT -> DOWN-LEFT)
    86, 90, 94, 98, 102, 105, 108, 111,
    # 40..47: 225° to 270° (DOWN-LEFT -> DOWN)
    113, 114, 114, 115, 115, 116, 116, 116,
    # 48..55: 270° to 315° (DOWN -> DOWN-RIGHT)
    116, 117, 117, 118, 118, 119, 119, 120,
    # 56..63: 315° to 360° (DOWN-RIGHT -> RIGHT)
    122, 125, 128, 132, 136, 139, 142, 145
]

# Small black bindi parameters
BINDI_RADIUS = 4.8
BINDI_COLOR = (18, 16, 20) # Deep charcoal black (BGR)
BROW_OFFSET = 8.0 # Offset up along facial symmetry axis from inner brow center

def inpaint_frame(img):
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[790:1020, 1590:1870] = 255
    return cv2.inpaint(img, mask, 6, cv2.INPAINT_TELEA)

print("Step 1: Reading video frames from source...")
cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print(f"Error opening video: {VIDEO_PATH}")
    sys.exit(1)

all_frames = {}
needed_indices = set(frame_map)
needed_indices.add(0) # Center direct eye-contact frame

frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret: break
    if frame_idx in needed_indices:
        all_frames[frame_idx] = frame
    frame_idx += 1
cap.release()

print(f"Loaded {len(all_frames)} frames from video.")

print("Step 2: Tracking 3D facial landmarks and symmetry axis...")
mp_face_mesh = mp.solutions.face_mesh
raw_tracked = []

with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.2) as face_mesh:
    for i, f_num in enumerate(frame_map):
        img = inpaint_frame(all_frames[f_num])
        h, w = img.shape[:2]
        res = face_mesh.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        lms = res.multi_face_landmarks[0].landmark
        
        p55 = lms[55]
        p285 = lms[285]
        p10 = lms[10]
        p152 = lms[152]
        p454 = lms[454]
        p234 = lms[234]
        p9 = lms[9]
        
        brow_cx = (p55.x + p285.x) * 0.5 * w
        brow_cy = (p55.y + p285.y) * 0.5 * h
        
        dx_up = (p10.x - p152.x) * w
        dy_up = (p10.y - p152.y) * h
        axis_len = np.sqrt(dx_up**2 + dy_up**2)
        ux = dx_up / axis_len
        uy = dy_up / axis_len
        
        bx = brow_cx + ux * BROW_OFFSET
        by = brow_cy + uy * BROW_OFFSET
        
        roll = np.degrees(np.arctan2(-dx_up, -dy_up))
        
        dist_left = abs(p454.x - p9.x)
        dist_right = abs(p9.x - p234.x)
        total_w = dist_left + dist_right
        yaw_ratio = min(dist_left, dist_right) / (total_w * 0.5) if total_w > 0 else 1.0
        scale_x = max(0.45, min(1.0, yaw_ratio))
        
        raw_tracked.append({
            'idx': i,
            'img': img,
            'bx': bx,
            'by': by,
            'roll': roll,
            'scale_x': scale_x
        })

print("Step 3: Cyclically smoothing 64 circular trajectory frames...")
n = len(raw_tracked)
def smooth_cyclic(values):
    return [0.5 * values[i] + 0.25 * values[(i - 1) % n] + 0.25 * values[(i + 1) % n] for i in range(n)]

bxs = smooth_cyclic([p['bx'] for p in raw_tracked])
bys = smooth_cyclic([p['by'] for p in raw_tracked])
rolls = smooth_cyclic([p['roll'] for p in raw_tracked])
scales = smooth_cyclic([p['scale_x'] for p in raw_tracked])

def render_bindi(img, bx, by, roll, scale_x):
    h, w = img.shape[:2]
    rad = BINDI_RADIUS
    rx = max(2, int(rad * scale_x))
    ry = int(rad)
    
    patch_r = 12
    x1 = max(0, int(bx) - patch_r)
    y1 = max(0, int(by) - patch_r)
    x2 = min(w, int(bx) + patch_r + 1)
    y2 = min(h, int(by) + patch_r + 1)
    
    patch = img[y1:y2, x1:x2].copy()
    ph, pw = patch.shape[:2]
    pcx = int(bx) - x1
    pcy = int(by) - y1
    
    overlay = patch.copy()
    cv2.ellipse(overlay, (pcx, pcy), (rx, ry), -roll, 0, 360, BINDI_COLOR, -1, cv2.LINE_AA)
    
    mask = np.zeros((ph, pw), dtype=np.uint8)
    cv2.ellipse(mask, (pcx, pcy), (rx, ry), -roll, 0, 360, 255, -1, cv2.LINE_AA)
    mask_blur = cv2.GaussianBlur(mask, (3, 3), 0.5) / 255.0
    
    blended = (overlay * mask_blur[:, :, None] + patch * (1.0 - mask_blur[:, :, None])).astype(np.uint8)
    out = img.copy()
    out[y1:y2, x1:x2] = blended
    return out

print("Step 4: Rendering small black bindi on 64 directional frames...")
for i, p in enumerate(raw_tracked):
    out = render_bindi(p['img'], bxs[i], bys[i], rolls[i], scales[i])
    out_path = os.path.join(OUT_DIR, f"{i:03d}.webp")
    cv2.imwrite(out_path, out, [cv2.IMWRITE_WEBP_QUALITY, 92])

print("Step 5: Rendering small black bindi on center frame (Frame 0)...")
raw_center = inpaint_frame(all_frames[0])
h, w = raw_center.shape[:2]

with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True) as face_mesh:
    res = face_mesh.process(cv2.cvtColor(raw_center, cv2.COLOR_BGR2RGB))
    lms = res.multi_face_landmarks[0].landmark
    p55 = lms[55]
    p285 = lms[285]
    p10 = lms[10]
    p152 = lms[152]
    
    brow_cx = (p55.x + p285.x) * 0.5 * w
    brow_cy = (p55.y + p285.y) * 0.5 * h
    dx_up = (p10.x - p152.x) * w
    dy_up = (p10.y - p152.y) * h
    axis_len = np.sqrt(dx_up**2 + dy_up**2)
    ux = dx_up / axis_len
    uy = dy_up / axis_len
    
    bx = brow_cx + ux * BROW_OFFSET
    by = brow_cy + uy * BROW_OFFSET
    roll = np.degrees(np.arctan2(-dx_up, -dy_up))
    
    final_center = render_bindi(raw_center, bx, by, roll, 1.0)
    cv2.imwrite(os.path.join(OUT_DIR, "center.webp"), final_center, [cv2.IMWRITE_WEBP_QUALITY, 92])

print("Done! All 65 frames have the small black bindi rendered perfectly in the center.")
