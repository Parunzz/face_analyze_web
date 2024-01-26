from flask import Flask, request, jsonify, make_response, session, redirect, url_for,send_from_directory, url_for
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
import threading



app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app, supports_credentials=True)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Update the origin


## FOR DEV ENV ###
host = "localhost"
user = "root"
password = ""

### FOR Docker ###
# host = "db"
# user = "admin"
# password = "admin"


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
        # remove model
        file_path = "./database/member/representations_facenet.pkl"
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"The file '{file_path}' has been successfully removed.")
        
        # Insert the new user into the database
        mycursor.execute("INSERT INTO person_info (FirstName, LastName , gender , DateOfBirth, img_path) VALUES (%s, %s, %s, %s, %s)", (AddfirstName, AddlastName , Addgender ,formatted_date, folder_path))
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
# Function to read an image file and convert it to base64
def image_to_base64(file_path):
    try:
        with open(file_path, 'rb') as f:
            img_data = f.read()
            base64_data = base64.b64encode(img_data).decode('utf-8')
        return base64_data
    except PermissionError:
        print(f"Permission denied to access file: {file_path}")
        return None
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return None
@app.route('/Memberdetail', methods=['POST'])
def Memberdetail():
    try:
        data = request.json
        pid = int(data.get('pid'))
        
        # Fetch member details
        mycursor.execute('SELECT * FROM person_info WHERE pid = %s', (pid,))
        member_info = mycursor.fetchall()

        if not member_info:
            return jsonify({'error': 'Member not found'}), 404

        # Extract image paths from member info
        img_directory = [row['img_path'] for row in member_info]
        img_paths = [os.path.join(img_directory[0], img) for img in os.listdir(img_directory[0]) if img.endswith('.jpg') or img.endswith('.png')]
        # Initialize a dictionary to store base64-encoded images
        base64_images = {}

        # Iterate over each image file path
        for img_path in img_paths:
            # Convert the image to base64
            print(img_path)
            base64_data = image_to_base64(img_path)
            # print(base64_data)
            # Add the base64 data to the dictionary with the image path as the key
            base64_images[img_path] = base64_data

        return make_response(jsonify({'MemberDetail': member_info, 'Base64Images': base64_images}), 200)

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/getMember', methods=['GET'])
def getMember():
    try:
        mycursor.execute('SELECT FirstName,LastName,pid FROM person_info')
        data = mycursor.fetchall()
        return make_response(jsonify({'Member': data }), 200)
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
        # remove model
        file_path = "./database/member/representations_facenet.pkl"
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"The file '{file_path}' has been successfully removed.")

    except Exception as e:
        print(f"Error removing folder: {str(e)}")  
@app.route('/removeMember', methods=['POST'])
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
        #print('Received JSON:', json_data)

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
        folder_path = './database/full_img/'
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        
        FullImg_save_path = os.path.join(folder_path, unique_filename)
        out_jpg = img.convert('RGB')
        out_jpg.save(FullImg_save_path)


        #------------------------IMG DETECT ------------------
        
        small_face = DeepFace.extract_faces(img_path=FullImg_save_path,enforce_detection=False, target_size=(224, 224), detector_backend='opencv')
        SmallImg_list = []
        # Iterate over each face object in the list
        for i, face in enumerate(small_face):
            # Generate a unique filename for each face
            unique_filename = str(uuid.uuid4()) + '.jpg'
            Img_save_path='./database/faces/'
            if not os.path.exists(Img_save_path):
                os.makedirs(Img_save_path)
            SmallImg_save_path = os.path.join(Img_save_path, unique_filename)
            SmallImg_list.append(SmallImg_save_path)
            # Save the face image
            mpimg.imsave(SmallImg_save_path, face['face'], format='jpg')
            print(f"Extract faces {i+1} saved successfully.")
        #----------------------face emotion detect --------------
        results = []
        for img_path in SmallImg_list:
            # Analyze emotions for the current image
            emotion_result = DeepFace.analyze(img_path=img_path, detector_backend='opencv', actions=['emotion'])
            if emotion_result:
                dominant_emotion = emotion_result[0]['dominant_emotion']
            else:
                dominant_emotion = None

            db_path='./database/member/'
            if not os.path.exists(db_path):
                os.makedirs(db_path)
            person_name_result = DeepFace.find(img_path=img_path, db_path=db_path, enforce_detection=True, model_name='Facenet')
            print(person_name_result)
            if not person_name_result[0].empty:
                person_name = person_name_result[0]['identity'][0].split('/')[3]
                print("ชื่อ : ",person_name)
                mycursor.execute('SELECT FirstName, pid FROM person_info WHERE FirstName = %s', (person_name,))
                person_info = mycursor.fetchone()
                if person_info:
                    person_name = person_info['FirstName']
                    person_pid = person_info['pid']
                else:
                    person_name = "Unknown"
                    person_pid = -1
            else:
                person_name = "Unknown"
                person_pid = -1
            
            mycursor.execute('SELECT emotion_id,response_text_id FROM emotion_data WHERE emotion_data = %s', (dominant_emotion,))
            emotion_data_result = mycursor.fetchone()
            if emotion_data_result is not None:
                emotion_id = emotion_data_result['emotion_id']
                response_text_id = emotion_data_result['response_text_id']
                mycursor.execute('SELECT response_text FROM response_text WHERE response_text_id = %s', (response_text_id,))
                response_text_result = mycursor.fetchone()
                if response_text_result is not None and 'response_text' in response_text_result:
                    response_text = response_text_result['response_text']
                else:
                    response_text = None

                # Insert the new user into the database
                current_datetime = datetime.now()
                date_mysql_format = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
                mycursor.execute("INSERT INTO data_info (pid, emotion_id, DateTime, Full_path, Cut_path) VALUES (%s, %s, %s, %s, %s)",
                                (person_pid, emotion_id, date_mysql_format, FullImg_save_path, SmallImg_save_path))
                mydb.commit()
            else:
                response_text = None
            
            
            results.append({
                'dominant_emotion': dominant_emotion,
                'person_name': person_name,
                'response_text': response_text
            })
        print("all done")
        print(results)
        return jsonify(results)

    except Exception as e:
        print("error",e)
        return jsonify({'error': str(e), 'dominant_emotion': "Error", 'person_name': 'unknown','response_text': 'หาไม่เจอ'}), 500



## MAIN ##
if __name__ == "__main__":
    #app.run(debug=True)
    app.run(host="0.0.0.0", port=3001,debug=True)
    