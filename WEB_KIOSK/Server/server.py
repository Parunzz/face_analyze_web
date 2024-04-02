from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from deepface import DeepFace
import base64
import cv2
import numpy as np


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app, supports_credentials=True)

#Machine learning
faces = []
old_image = ''
No_faceDetect = 0
@app.route('/api/Detect_face', methods=['POST'])
def DrawRec():
    global faces
    global old_image 
    global No_faceDetect
    NewPerson = ''
    facial_area = []
    JSON = []
    index = None
    try:
        # if 'image' not in request.files:
        #     return jsonify({'error': 'No image found in the request'}), 400
        # json_data = request.get_json()
        # image = json_data.get('image')

        image_file  = request.files['image']
        image_data = image_file.read()
        base64_string = base64.b64encode(image_data).decode('utf-8')
        image = f"data:image/jpg;base64,{base64_string}"
        face_objs = DeepFace.extract_faces(img_path = image, 
            target_size = (250, 250), 
            detector_backend = 'opencv',
            enforce_detection=False
        )
        should_append = True
        for f in face_objs:
            # facial_area.append(f['facial_area'])
            if f['confidence'] == 0:
                if No_faceDetect == 5:
                    faces = []
                    No_faceDetect = 0
                else:
                    No_faceDetect += 1
                NewPerson = 'False'
                print("No face detect --------------------------")
                result = {
                    'faces': None,
                    'NewPerson': NewPerson,
                    'face_index': None
                }
                should_append = False
                JSON.append(result)
                break
            new_face = f['face']
            # Check if the new embedding is close to any existing embedding
            
            for old_face in faces:
                result = DeepFace.verify(
                    img1_path=new_face,  # Use the image data for the first face
                    img2_path=old_face,  # Use the image data for the second face
                    model_name="SFace",
                    detector_backend='opencv',
                    distance_metric='euclidean_l2',
                    enforce_detection=False
                )
                verified = result['verified']
                if verified:
                    should_append = False
                    NewPerson = 'False'
                    break
            
            if should_append:
                print("New Person.")
                face_array = f['face']
                face_array = (face_array * 255).astype(np.uint8)
                face_array_bgr = cv2.cvtColor(face_array, cv2.COLOR_RGB2BGR)
                # Save the face array as an image
                # face_path = 'Temp.jpg'
                # cv2.imwrite(face_path, face_array_bgr)
                retval, buffer = cv2.imencode('.jpg', face_array_bgr)
                face_base64 = base64.b64encode(buffer)
                face_image = f"data:image/png;base64,{face_base64.decode('utf-8')}"
                
                faces.append(new_face)
                index = len(faces) - 1
                NewPerson = 'True'
                full_image = image
            else:
                print("Same Person.")
                NewPerson = 'False'
                full_image = None
                face_image = None
            result = {
                'faces': f['facial_area'],
                'NewPerson': NewPerson,
                'face_index': index,
                'full_image': full_image,
                'face_image': face_image
            }
            JSON.append(result)
        return make_response(jsonify(JSON), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500   

## MAIN ##
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3002,debug=True)
    