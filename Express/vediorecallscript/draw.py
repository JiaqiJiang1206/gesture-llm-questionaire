# Description: 从json文件中读取人体姿态数据，绘制人体姿态图像，并生成视频
# 注意json文件的路径，以及json文件如果语法有错的话，需要手动修正一下

import json
import cv2
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import numpy as np

def plot_landmarks(landmarks, ax, width=1280, height=720, connections=[]):
    valid_indices = [idx for idx, point in enumerate(landmarks) if 0 <= point['x'] <= 1 and 0 <= point['y'] <= 1]
    x = [landmarks[idx]['x'] * width for idx in valid_indices]
    y = [landmarks[idx]['y'] * height for idx in valid_indices]

    # 绘制连接线
    for (start_idx, end_idx) in connections:
        if start_idx in valid_indices and end_idx in valid_indices:
            ax.plot([landmarks[start_idx]['x'] * width, landmarks[end_idx]['x'] * width],
                    [landmarks[start_idx]['y'] * height, landmarks[end_idx]['y'] * height], 'g-', linewidth=2)  # 线条颜色为绿色，宽度为2

    ax.scatter(x, y, s=10, c='orange')  # 设置点的大小为10，颜色为橙色

def plot_frame(data, width=1280, height=720):
    fig, ax = plt.subplots(figsize=(width/100, height/100), dpi=100)
    ax.set_xlim(0, width)
    ax.set_ylim(height, 0)  # 反转y轴
    ax.axis('off')  # 不显示坐标轴

    all_body_results = data.get('allBodyResults', [])
    
    # 连接线定义
    body_connections = [(8, 6), (6, 5), (5, 4), (4, 0), (0, 1), (1, 2), (2, 3), (3, 7),
                        (10, 9), (16, 14), (14, 12), (12, 11), (11, 13), (13, 15), 
                        (12, 24), (11, 23), (23, 24), (24, 26), (26, 28), (28, 30), 
                        (30, 32), (23, 25), (25, 27), (27, 29), (27, 31), (29, 31)]
    
    left_hand_connections = [(0, 1), (1, 2), (2, 3), (3, 4), (0, 5), (5, 6), (6, 7), (7, 8), (5, 9), (9, 10), (10, 11), (11, 12), (9, 13), (13, 14), (14, 15), (15, 16), (13, 17), (17, 18), (18, 19), (19, 20), (0, 17)
        # 填写左手连线的点对
    ]
    
    right_hand_connections = [(0, 1), (1, 2), (2, 3), (3, 4), (0, 5), (5, 6), (6, 7), (7, 8), (5, 9), (9, 10), (10, 11), (11, 12), (9, 13), (13, 14), (14, 15), (15, 16), (13, 17), (17, 18), (18, 19), (19, 20), (0, 17)
        # 填写右手连线的点对
    ]
    
    if len(all_body_results) == 1:
        body_data = all_body_results[0]
        plot_landmarks(body_data['landmarks'][0], ax, width, height, connections=body_connections)
        
    elif len(all_body_results) == 2:
        body_data = all_body_results[1]
        hand_data = all_body_results[0]
        
        # Plot body landmarks
        plot_landmarks(body_data['landmarks'][0], ax, width, height, connections=body_connections)
        
        # Get handedness information
        handednesses = hand_data.get('handednesses', [])
        left_hand_landmarks = None
        right_hand_landmarks = None
        
        if len(handednesses) == 2:
            left_hand_landmarks = hand_data['landmarks'][0]
            right_hand_landmarks = hand_data['landmarks'][1]
        elif len(handednesses) == 1:
            if handednesses[0][0]['categoryName'] == 'Left':
                right_hand_landmarks = hand_data['landmarks'][0]
            elif handednesses[0][0]['categoryName'] == 'Right':
                left_hand_landmarks = hand_data['landmarks'][0]
        
        # Plot hand landmarks
        if left_hand_landmarks:
            plot_landmarks(left_hand_landmarks, ax, width, height, connections=left_hand_connections)
        if right_hand_landmarks:
            plot_landmarks(right_hand_landmarks, ax, width, height, connections=right_hand_connections)
    
    canvas = FigureCanvas(fig)
    canvas.draw()
    img = np.frombuffer(canvas.tostring_rgb(), dtype='uint8')
    img = img.reshape(fig.canvas.get_width_height()[::-1] + (3,))
    plt.close(fig)
    return img

def create_video_from_json(json_file, output_file, frame_rate=10, width=1280, height=720):
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video = cv2.VideoWriter(output_file, fourcc, frame_rate, (width, height))
    
    for frame_data in data:
        img = plot_frame(frame_data, width, height)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        video.write(img)
    
    video.release()

# 调用函数生成视频
create_video_from_json('try.json', 'output_video.mp4')
