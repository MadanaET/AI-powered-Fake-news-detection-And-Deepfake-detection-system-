import cv2
import numpy as np

width, height = 640, 480
fps = 30
duration = 3  # seconds
output_path = 'sample_deepfake.mp4'

out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

for i in range(fps * duration):
    # Create a noisy background to simulate "pixel artifacts"
    frame = np.random.randint(0, 100, (height, width, 3), dtype=np.uint8)
    
    # Add text
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(frame, 'Sample Deepfake Video', (50, 240), font, 1.5, (0, 0, 255), 3, cv2.LINE_AA)
    cv2.putText(frame, f'Frame: {i}', (50, 300), font, 1, (255, 255, 255), 2, cv2.LINE_AA)
    
    out.write(frame)

out.release()
print(f"Created {output_path}")
