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
import jwt
from datetime import datetime




app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app, supports_credentials=True)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Update the origin



host = "db"
# host = "localhost"
user = "admin"
# user = "root"
password = "admin"
# password = ""
db = "deepface"
mydb = mysql.connector.connect(host=host,user=user,password=password,db=db)
mycursor = mydb.cursor(dictionary=True)

@app.route("/")
def index():
    return "Server"
#-------------------------------------database--------------------------------------
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
        mycursor.execute("INSERT INTO user (Username, Password , FirstName , LastName) VALUES (%s, %s, %s, %s)", (Regusername, Regpassword , Regfirstname ,Reglastname))
        mydb.commit()

        return make_response(jsonify({'message': 'User registered successfully'}), 200)

    except Exception as e:
        error_message = str(e)
        # print("Error: ",{error_message})
        return make_response(jsonify({'error': str(e)}), 500)
@app.route('/AddMember', methods=['POST'])
def AddMember():
    try:
        data = request.json
        # print(data)
        AddfirstName = data.get('firstName')
        AddlastName = data.get('lastName')
        Addgender = data.get('gender')
        Addmydate = data.get('mydate')
        image_data = data.get('imgUpload')

        # Check if the user already exists
        mycursor.execute("SELECT * FROM person_info WHERE FirstName = %s AND LastName = %s", (AddfirstName, AddlastName))
        existing_user = mycursor.fetchone()

        if existing_user:
            return make_response(jsonify({'message': 'Member already exists'}), 400)
        
        date_object = datetime.strptime(Addmydate, '%m/%d/%Y')
        formatted_date = date_object.strftime('%Y-%m-%d')
        
        #-----------------------img-------------------------------
        
        
        # Decode the base64-encoded string
        bytes_decoded = base64.b64decode(image_data)

        # Create an image from the decoded bytes
        img = Image.open(BytesIO(bytes_decoded))
        
        unique_filename = str(uuid.uuid4()) + '.jpg'
        folder_path = f'./database/member/{AddfirstName}/'
        os.makedirs(folder_path)
        member_path = os.path.join(folder_path, unique_filename)
        out_jpg = img.convert('RGB')
        out_jpg.save(member_path)
        #-----------------------img-------------------------------


        # Insert the new user into the database
        mycursor.execute("INSERT INTO person_info (FirstName, LastName , gender , DateOfBirth, img_path) VALUES (%s, %s, %s, %s, %s)", (AddfirstName, AddlastName , Addgender ,formatted_date, member_path))
        mydb.commit()

        return make_response(jsonify({'message': 'Add Member successfully'}), 200)

    except Exception as e:
        error_message = str(e)
        print("Error: ",{error_message})
        return make_response(jsonify({'error': str(e)}), 500)

SECRET_KEY = 'zen'
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
        token = jwt.encode({'username': username}, SECRET_KEY, algorithm='HS256')
        print(token)
        return jsonify({'token': token}), 200
    else:
        # Authentication failed
        return jsonify({'error': 'Invalid credentials'}), 401

# Sent Member IMG
@app.route('/getimg', methods=['GET'])
def getimg():
    try:
        mycursor.execute('SELECT img_path,FirstName,LastName,pid FROM person_info')
        img_paths = mycursor.fetchall()
        # print(img_paths)
        # return make_response(jsonify(img_paths), 200)
        img_data = []
        for path in img_paths:
            # print(path)
            image_path = path.get('img_path')
            Fname = path.get('FirstName')
            Lname = path.get('LastName')
            Pid = path.get('pid')
            if os.path.exists(image_path):
                with open(image_path, "rb") as image_file:
                    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                    img_data.append({'img_path': image_path, 'base64': encoded_image , 'fname': Fname, 'lname':Lname, 'pid':Pid})
            else:
                img_data.append({'img_path': image_path, 'base64': None})

        return make_response(jsonify({'images': img_data }), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)})
    
#Remove Member #
def remove_image_file(folder_path):
    try:
        for item in os.listdir(folder_path):
            item_path = os.path.join(folder_path, item)
            if os.path.isfile(item_path):
                os.remove(item_path)
            elif os.path.isdir(item_path):
                remove_image_file(item_path)
        # Remove the empty folder
        os.rmdir(folder_path)
        print(f'Removed folder: {folder_path}')
    except Exception as e:
        print(f"Error removing folder: {str(e)}")  
@app.route('/rmimg', methods=['POST'])
def rmimg():
    try:
        data = request.json
        pid = data.get('pid')

        # Check if the person with the given PID exists before deleting
        mycursor.execute('SELECT * FROM person_info WHERE pid = %s', (pid,))
        person = mycursor.fetchone()

        if not person:
            return jsonify({'error': f'Person with PID {pid} not found'})

        # Get the filename or path of the associated image
        image_filename = person['img_path'] 
        folder_path = f'./database/member/{person["FirstName"]}/'
        # Perform deletion from the database
        mycursor.execute('DELETE FROM person_info WHERE `person_info`.`pid` = %s', (pid,))
        mydb.commit()

        # Remove the associated image file from the server file system
        if image_filename:
            remove_image_file(folder_path)

        return jsonify({'message': f'Successfully deleted person with PID {pid}'})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)})
    
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
    


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host="0.0.0.0", port=3001)
    