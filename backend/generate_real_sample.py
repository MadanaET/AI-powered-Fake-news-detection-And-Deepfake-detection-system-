import cv2
import numpy as np

width, height = 640, 480
fps = 30
duration = 3  # seconds
output_path = 'sample_real.mp4'

out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

for i in range(fps * duration):
    # Create a clean, smooth green background for a "real" video
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    frame[:] = (50, 150, 50) # Nice solid green color
    
    # Add clean text
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(frame, 'Sample Authentic Video', (80, 240), font, 1.2, (255, 255, 255), 3, cv2.LINE_AA)
    cv2.putText(frame, f'Clean Frame: {i}', (80, 300), font, 1, (200, 255, 200), 2, cv2.LINE_AA)
    
    out.write(frame)

out.release()
print(f"Created {output_path}")
