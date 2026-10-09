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

BINDI_COLOR = (18, 16, 20)  # Deep carbon black (BGR)
BASE_RADIUS = 4.5

def inpaint_frame(img):
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[790:1020, 1590:1870] = 255
    return cv2.inpaint(img, mask, 6, cv2.INPAINT_TELEA)

def render_bindi_3d(img, face_mesh):
    h, w = img.shape[:2]
    res = face_mesh.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    if not res.multi_face_landmarks:
        print("Warning: No face detected!")
        return img
    lms = res.multi_face_landmarks[0].landmark

    # 3D Forehead landmarks from MediaPipe FaceMesh:
    # 8: Glabella (between lower brows)
    # 9: Mid-forehead (midline upper forehead)
    # 107: Right inner eyebrow tip
    # 336: Left inner eyebrow tip
    p8 = lms[8]
    p9 = lms[9]
    p107 = lms[107]
    p336 = lms[336]

    # Midpoint of inner eyebrows:
    brow_mid_x = (p107.x + p336.x) * 0.5
    brow_mid_y = (p107.y + p336.y) * 0.5
    brow_mid_z = (p107.z + p336.z) * 0.5

    # Forehead midline vertical vector from glabella to mid-forehead:
    v_up_x = p9.x - p8.x
    v_up_y = p9.y - p8.y
    v_up_z = p9.z - p8.z

    # Center of bindi in normalized and pixel coords:
    # Positioned along the 3D midline, 25% of the distance from brow midpoint to mid-forehead
    cx = (brow_mid_x + v_up_x * 0.25) * w
    cy = (brow_mid_y + v_up_y * 0.25) * h

    # 2D orientation vector of her forehead:
    vh_2d = np.array([(p336.x - p107.x) * w, (p336.y - p107.y) * h])
    angle_deg = np.degrees(np.arctan2(vh_2d[1], vh_2d[0]))

    # 3D Normal for perspective foreshortening:
    v_h_3d = np.array([p336.x - p107.x, p336.y - p107.y, p336.z - p107.z])
    v_v_3d = np.array([v_up_x, v_up_y, v_up_z])
    normal = np.cross(v_h_3d, v_v_3d)
    norm_len = np.linalg.norm(normal)
    if norm_len > 1e-6:
        normal = normal / norm_len
    else:
        normal = np.array([0, 0, 1])

    # Perspective foreshortening:
    scale_h = max(0.40, np.sqrt(max(0.01, 1.0 - normal[0]**2)))
    scale_v = max(0.50, np.sqrt(max(0.01, 1.0 - normal[1]**2)))

    rx = max(2, int(round(BASE_RADIUS * scale_h)))
    ry = max(2, int(round(BASE_RADIUS * scale_v)))

    # Anti-aliased sub-pixel rendering with gentle edge blur:
    patch_r = 14
    icx, icy = int(round(cx)), int(round(cy))
    y1 = max(0, icy - patch_r)
    y2 = min(h, icy + patch_r + 1)
    x1 = max(0, icx - patch_r)
    x2 = min(w, icx + patch_r + 1)

    patch = img[y1:y2, x1:x2].copy()
    ph, pw = patch.shape[:2]
    pcx = icx - x1
    pcy = icy - y1

    overlay = patch.copy()
    cv2.ellipse(overlay, (pcx, pcy), (rx, ry), angle_deg, 0, 360, BINDI_COLOR, -1, cv2.LINE_AA)

    mask = np.zeros((ph, pw), dtype=np.uint8)
    cv2.ellipse(mask, (pcx, pcy), (rx, ry), angle_deg, 0, 360, 255, -1, cv2.LINE_AA)
    mask_blur = cv2.GaussianBlur(mask, (3, 3), 0.5) / 255.0

    blended = (overlay * mask_blur[:, :, None] + patch * (1.0 - mask_blur[:, :, None])).astype(np.uint8)
    out = img.copy()
    out[y1:y2, x1:x2] = blended
    return out

def main():
    print("Step 1: Loading video frames from source...")
    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        print(f"Error opening video: {VIDEO_PATH}")
        sys.exit(1)

    all_frames = {}
    needed_indices = set(frame_map)
    needed_indices.add(0)

    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx in needed_indices:
            all_frames[frame_idx] = frame
        frame_idx += 1
    cap.release()

    print(f"Loaded {len(all_frames)} frames from video.")

    print("Step 2: Processing 64 directional frames with 3D facial surface anchor...")
    mp_face_mesh = mp.solutions.face_mesh
    with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.2) as face_mesh:
        for i, f_num in enumerate(frame_map):
            inpainted = inpaint_frame(all_frames[f_num])
            out = render_bindi_3d(inpainted, face_mesh)
            out_path = os.path.join(OUT_DIR, f"{i:03d}.webp")
            cv2.imwrite(out_path, out, [cv2.IMWRITE_WEBP_QUALITY, 92])
            if (i + 1) % 16 == 0 or i == len(frame_map) - 1:
                print(f"  Processed frame {i+1}/{len(frame_map)}")

        print("Step 3: Processing neutral center frame (Frame 0)...")
        center_inpainted = inpaint_frame(all_frames[0])
        final_center = render_bindi_3d(center_inpainted, face_mesh)
        center_path = os.path.join(OUT_DIR, "center.webp")
        cv2.imwrite(center_path, final_center, [cv2.IMWRITE_WEBP_QUALITY, 92])
        print("  Processed center.webp")

    print("Success: All 65 frames have been updated with 3D surface-anchored black bindi!")

if __name__ == "__main__":
    main()
