from flask import Flask, request, jsonify, make_response, session, redirect, url_for
from flask_cors import CORS
import json
import mysql.connector
from deepface import DeepFace
import base64
import cv2
import numpy as np
import os
from io import BytesIO
from PIL import Image
import uuid
import matplotlib.image as mpimg
from werkzeug.security import check_password_hash
from datetime import timedelta




app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app, supports_credentials=True)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Update the origin



host = "db"
user = "root"
password = "MYSQL_ROOT_PASSWORD"
db = "deepface"
mydb = mysql.connector.connect(host=host,user=user,password=password,db=db)
mycursor = mydb.cursor(dictionary=True)

@app.route("/")
def index():
    return "Server"
#-------------------------------------database--------------------------------------
@app.route("/user")
def show():
    # mydb = mysql.connector.connect(host=host,user=user,password=password,db=db)
    # mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT * FROM user")
    myresult = mycursor.fetchall()

    return make_response(jsonify(myresult),200)

@app.route('/register', methods=['POST'])
def Register():
    try:
        # # Connect to the database
        # mydb = mysql.connector.connect(host=host, user=user, password=password, db=db)
        # mycursor = mydb.cursor()

        # Get user data from the request
        data = request.json
        # print(data)
        Regusername = data.get('username')
        Regpassword = data.get('password')
        Regfirstname = data.get('firstName')
        Reglastname = data.get('lastName')

        # Check if the user already exists
        mycursor.execute("SELECT * FROM user WHERE Username = %s", (Regusername,))
        existing_user = mycursor.fetchone()

        if existing_user:
            return make_response(jsonify({'message': 'User already exists'}), 400)

        # Insert the new user into the database
        mycursor.execute("INSERT INTO user (Username, Password , Firstname , Lastname) VALUES (%s, %s, %s, %s)", (Regusername, Regpassword , Regfirstname ,Reglastname))
        mydb.commit()

        return make_response(jsonify({'message': 'User registered successfully'}), 200)

    except Exception as e:
        error_message = str(e)
        # print("Error: ",{error_message})
        return make_response(jsonify({'error': str(e)}), 500)
    
app.secret_key = "zen"
app.permanent_session_lifetime = timedelta(days=1)
@app.route('/login', methods=['POST'])
def signin():

    data = request.json  # Assuming JSON data is sent from the frontend
    # print(data)
    username = data.get('username')
    password = data.get('password')

    # mycursor.execute('SELECT Username, Password FROM user WHERE Username=%s AND Password=%s', (username, password))
    mycursor.execute('SELECT Username, Password FROM user WHERE Username=%s AND Password=%s', (username, password))

    user = mycursor.fetchone()

    if user:
        # Authentication successful
        session.permanent = True
        session['username'] = username
        print("Session after login:", session)
        return jsonify({'message': 'Sign-in successful'}), 200
    else:
        # Authentication failed
        return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/check_login/')
def check_login():
    print("check : ", session)
    if 'username' in session:
        return jsonify({'message': 'User is logged in'}), 200
    else:
        return jsonify({'message': 'User is not logged in'}), 401
    
@app.route('/logout/')
def logout():
    try:
        session.clear()
        print("clear",session)
        response = make_response(jsonify({'message': 'Logout successful'}), 200)
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.set_cookie('session', '', expires=0)
        return response
    except Exception as e:
        print(f"Error during logout: {e}")
        return jsonify({'error': 'Logout failed'}), 500

#--------------------- Machine learning ----------------------------------------------------------------
@app.route('/api/save_fullImg', methods=['POST'])
def process_image():
    try:
        # Get the JSON payload from the request
        json_data = request.get_json()
        # print('Received JSON:', json_data)

        # Extract the base64-encoded string from the 'data' field
        image_data = json_data.get('image', '')
        split_data  = image_data.split(',')
        if len(split_data) > 1:
            encoded_string = split_data[1]
        else:
            # print('Invalid image data format:', image_data)
            # Handle the case where the split did not produce the expected number of elements
            return jsonify({'error': 'Invalid image data format'}), 400

        # Decode the base64-encoded string
        bytes_decoded = base64.b64decode(encoded_string)

        # Create an image from the decoded bytes
        img = Image.open(BytesIO(bytes_decoded))

       # Generate a unique filename using UUID
        unique_filename = str(uuid.uuid4()) + '.jpg'

        # Save the processed image with the unique filename
        FullImg_save_path = './database/full_img/' + unique_filename
        
        out_jpg = img.convert('RGB')
        out_jpg.save(FullImg_save_path)


        #------------------------IMG DETECT ------------------
        
        # small_face = DeepFace.extract_faces(img_path=FullImg_save_path, target_size=(224, 224), detector_backend='opencv')
        imgn = Image.open(FullImg_save_path)
        img_array = np.array(imgn)
        # print(img_array)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(img_array, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        # Check if faces are detected
        if len(faces) > 0:
            for (x, y, w, h) in faces:
                # Crop the face from the image
                face_image = img_array[y:y+h, x:x+w]
                unique_filename = str(uuid.uuid4()) + '.jpg'
                SmallImg_save_path = './database/cut_img/' + unique_filename
                mpimg.imsave(SmallImg_save_path, face_image, format='jpg')

            print(f"{len(faces)} face(s) detected and saved.")

        else:
            print("No faces detected.")
            return jsonify({'error': 'Emotion analysis result not found or missing dominant_emotion.'})
            #----------------------face emotion detect --------------
        emo_result = DeepFace.analyze(img_path = SmallImg_save_path,detector_backend = 'opencv',actions=("emotion"))
        if emo_result and 'emotion' in emo_result[0]:
            dominant_emotion = emo_result[0]['dominant_emotion']
            print(dominant_emotion)
            # print(small_face)
            return jsonify({'dominant_emotion': dominant_emotion})

        else:
            return jsonify({'error': 'Emotion analysis result not found or missing dominant_emotion.'})
        #------------------------------------------

        # return jsonify({'message': 'Image processed successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# @app.route("/api/extract_faces", methods=['POST'])
# def extract_faces():
#     try:
#         data = request.get_json()
#         # img_path = data.get('img_path', '')
#         # print(data)
#         # result = save_base64_as_jpg(data,'database/cut_img/c.jpg')
#         return data
#         # if img_path:
#         #     result = DeepFace.extract_faces(img_path=img_path, target_size=(224, 224), detector_backend='opencv')
#         # elif img_base64:
#         #     save_base64_as_image(img_base64, 'database/full_img/img.jpg')  # Save the base64 image
#         #     img = convert_base64_to_numpy(img_base64)
#         #     result = DeepFace.detectFace(img, detector_backend='opencv')
#         # else:
#         #     return jsonify({'error': 'Either img_path or img_base64 must be provided.'})

#         # if result and 'face' in result[0]:
#         #     face_image = result[0]['face']
#         #     cv2.imwrite(os.path.join('./database/cut_img/', 'face_image.jpg'), face_image)
#         #     return jsonify({'result': result})
#         # else:
#         #     return jsonify({'error': 'No face found in the image or missing face key in the result.'})

#     except Exception as e:
#         print("error")
#         return jsonify({'error': str(e)})

# @app.route("/api/find", methods=['POST'])
# def find_faces():
#     try:
#         data = request.get_json()
#         img_path = data.get('img_path', '')
#         result = DeepFace.find(img_path, db_path='./database/', enforce_detection=False, model_name='Facenet')

#         print(result)

#         if result and 'identity' in result[0]:
#             return jsonify(result[0]['identity'][0].split('/')[2])
#         else:
#             return jsonify({'error': 'No face found in the image or missing face key in the result.'})
#     except Exception as e:
#         print("error")
#         return jsonify({'error': str(e)})
 

if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host="0.0.0.0", port=5000)
    