import cv2
import numpy as np
import os
import sys

VIDEO_PATH = r"C:\porfolio_riya\Woman_moving_head_and_eyes_20261008162542.mp4"
OUT_DIR = r"portfolio-hero/public/frames"
os.makedirs(OUT_DIR, exist_ok=True)

# 8 compass anchor directions mapped to video frames
# 0° = RIGHT, 45° = UP-RIGHT, 90° = UP, 135° = UP-LEFT
# 180° = LEFT, 225° = DOWN-LEFT, 270° = DOWN, 315° = DOWN-RIGHT
ANCHOR_FRAMES = {
    0:   182,  # RIGHT
    45:  160,  # UP-RIGHT
    90:   24,  # UP
    135:  54,  # UP-LEFT
    180:  76,  # LEFT
    225: 100,  # DOWN-LEFT
    270: 126,  # DOWN
    315: 200,  # DOWN-RIGHT
}

# Inpaint Kling AI watermark sparkle at bottom right [800:1080, 1600:1920] -> [790:1020, 1590:1870]
def inpaint_frame(img):
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[790:1020, 1590:1870] = 255
    return cv2.inpaint(img, mask, 6, cv2.INPAINT_TELEA)

# Interpolate 64 frames evenly around 360° circle (every 5.625°)
angles = np.linspace(0, 360, 64, endpoint=False)

def get_mapped_frame_idx(angle):
    # Anchor keys in sorted order
    anchor_deg = [0, 45, 90, 135, 180, 225, 270, 315, 360]
    anchor_f   = [182, 160, 24, 54, 76, 100, 126, 200, 182]
    
    for i in range(len(anchor_deg) - 1):
        if anchor_deg[i] <= angle <= anchor_deg[i+1]:
            t = (angle - anchor_deg[i]) / (anchor_deg[i+1] - anchor_deg[i])
            f_idx = int(round(anchor_f[i] + t * (anchor_f[i+1] - anchor_f[i])))
            return max(0, min(239, f_idx))
    return 182

cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print(f"Error opening video: {VIDEO_PATH}")
    sys.exit(1)

total_fc = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
all_frames = {}
frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    all_frames[frame_idx] = frame
    frame_idx += 1
cap.release()

print(f"Loaded {len(all_frames)} frames from video (CAP reported {total_fc}).")

# Save 64 circular frames
for i, ang in enumerate(angles):
    f_num = get_mapped_frame_idx(ang)
    raw = all_frames[f_num]
    cleaned = inpaint_frame(raw)
    out_path = os.path.join(OUT_DIR, f"{i:03d}.webp")
    cv2.imwrite(out_path, cleaned, [cv2.IMWRITE_WEBP_QUALITY, 92])

# Save center direct eye-contact frame (Frame 0)
raw_center = all_frames[0]
cleaned_center = inpaint_frame(raw_center)
cv2.imwrite(os.path.join(OUT_DIR, "center.webp"), cleaned_center, [cv2.IMWRITE_WEBP_QUALITY, 92])

print(f"Successfully extracted 64 circular frames + center.webp into {OUT_DIR}")
