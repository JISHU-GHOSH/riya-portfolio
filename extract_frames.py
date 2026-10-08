import cv2
import numpy as np
import os
import sys

VIDEO_PATH = r"C:\porfolio_riya\Woman_moving_head_and_eyes_20261008162542.mp4"
OUT_DIR = r"portfolio-hero/public/frames"
os.makedirs(OUT_DIR, exist_ok=True)

# 64-frame counter-clockwise continuous circular mapping:
# 0..7:   RIGHT (0°) -> UP-RIGHT (45°)
# 8..15:  UP-RIGHT (45°) -> UP (90°)
# 16..23: UP (90°) -> UP-LEFT (135°)
# 24..31: UP-LEFT (135°) -> LEFT (180°)
# 32..39: LEFT (180°) -> DOWN-LEFT (225°)
# 40..47: DOWN-LEFT (225°) -> DOWN (270°)
# 48..55: DOWN (270°) -> DOWN-RIGHT (315°)
# 56..63: DOWN-RIGHT (315°) -> RIGHT (360°/0°)
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

# Watermark inpainting mask for Kling AI sparkle
def inpaint_frame(img):
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[790:1020, 1590:1870] = 255
    return cv2.inpaint(img, mask, 6, cv2.INPAINT_TELEA)

cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print(f"Error opening video: {VIDEO_PATH}")
    sys.exit(1)

all_frames = {}
frame_idx = 0
needed_indices = set(frame_map)
needed_indices.add(0) # Center direct eye-contact frame

while True:
    ret, frame = cap.read()
    if not ret: break
    if frame_idx in needed_indices:
        all_frames[frame_idx] = frame
    frame_idx += 1
cap.release()

print(f"Loaded {len(all_frames)} needed video frames.")

# Save 64 circular trajectory WebP frames
output_frames = []
for i, f_num in enumerate(frame_map):
    raw = all_frames[f_num]
    cleaned = inpaint_frame(raw)
    output_frames.append(cleaned)
    out_path = os.path.join(OUT_DIR, f"{i:03d}.webp")
    cv2.imwrite(out_path, cleaned, [cv2.IMWRITE_WEBP_QUALITY, 92])

# Save center direct eye-contact frame (Frame 0)
raw_center = all_frames[0]
cleaned_center = inpaint_frame(raw_center)
cv2.imwrite(os.path.join(OUT_DIR, "center.webp"), cleaned_center, [cv2.IMWRITE_WEBP_QUALITY, 92])

print(f"Successfully saved 64 WebP frames + center.webp into {OUT_DIR}")
