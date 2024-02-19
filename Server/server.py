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
mydb = mysql.connector.connect(host="localhost",user="root",password="",db="deepface",connect_timeout=100)
### FOR Docker ###
#mydb = mysql.connector.connect(host="db",user="admin",password="admin",db="deepface",connect_timeout=10000)
### FOR NETWORK
# mydb = mysql.connector.connect(host="192.168.1.53",user="zen",password="zen",db="deepface",connect_timeout=100)
mycursor = mydb.cursor(dictionary=True)

@app.route("/")
def index():
    return "Server"
#database
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
        
        #img
        
        
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
        #img
        # Iterate over all files in the directory
        directory = "./database/member/"
        for filename in os.listdir(directory):
            if filename.endswith(".pkl"):
                file_path = os.path.join(directory, filename)  # Get the full path of the file
                os.remove(file_path)  # Remove the file
                print(f"Removed: {file_path}")
  
        DeepFace.find(img_path=member_path, db_path='./database/member/', enforce_detection=False)
        # Insert the new user into the database
        mycursor.execute("INSERT INTO person_info (FirstName, LastName , gender , DateOfBirth, img_path) VALUES (%s, %s, %s, %s, %s)", (AddfirstName, AddlastName , Addgender ,formatted_date, folder_path))
        mydb.commit()

        return make_response(jsonify({'message': 'Add Member successfully'}), 200)

    except Exception as e:
        error_message = str(e)
        print("Error: ",{error_message})
        return make_response(jsonify({'error': str(e)}), 500)
    
@app.route('/UpdateMember', methods=['POST'])
def UpdateMember():
    try:
        data = request.json
        AddfirstName = data.get('firstName')
        AddlastName = data.get('lastName')
        Addgender = data.get('gender')
        Addmydate = data.get('mydate')
        image_data = data.get('imgUpload')
        pid = int(data.get('pid'))
        date_object = datetime.strptime(Addmydate, '%m/%d/%Y')
        formatted_date = date_object.strftime('%Y-%m-%d')

        mycursor.execute("SELECT FirstName FROM person_info WHERE pid = %s", (pid,))

        FirstName = mycursor.fetchone()

        if FirstName is None or FirstName['FirstName'] is None:
            return make_response(jsonify({'message': 'No Member found'}), 400)
        
        FirstName = FirstName['FirstName']
        folder_path = f'./database/member/{FirstName}/'
        new_folder_path = f'./database/member/{AddfirstName}/'
        os.rename(folder_path, new_folder_path)

        # save img
        # Decode the base64-encoded string
        if image_data is not None:
            bytes_decoded = base64.b64decode(image_data)

            # Create an image from the decoded bytes
            img = Image.open(BytesIO(bytes_decoded))
        
            unique_filename = str(uuid.uuid4()) + '.jpg'
            member_path = os.path.join(new_folder_path, unique_filename)
            out_jpg = img.convert('RGB')
            out_jpg.save(member_path)

            # remove model
            directory = "./database/member/"

            # Iterate over all files in the directory
            for filename in os.listdir(directory):
                if filename.endswith(".pkl"):
                    file_path = os.path.join(directory, filename)  # Get the full path of the file
                    os.remove(file_path)  # Remove the file
                    print(f"Removed: {file_path}")
                
            DeepFace.find(img_path=member_path, db_path='./database/member/', enforce_detection=False)
    
        
        # Insert the new user into the database
        mycursor.execute("UPDATE person_info SET FirstName = %s, LastName = %s, gender = %s, DateOfBirth = %s, img_path = %s WHERE pid = %s", (AddfirstName, AddlastName, Addgender, formatted_date, new_folder_path, pid))
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
    
def remove_files_and_folder(folder_path):
    try:
        # Iterate over all files in the folder
        for file_name in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file_name)
            # Check if the file is a regular file
            if os.path.isfile(file_path):
                # Remove the file
                os.remove(file_path)
                print(f"Removed file: {file_path}")

        # Remove the folder
        os.rmdir(folder_path)
        print(f"Removed folder: {folder_path}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

@app.route('/removeMember', methods=['POST'])
def removeMember():
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
        if os.path.exists(image_filename):
            remove_files_and_folder(image_filename)
            print("File removed successfully")
        else:
            print("File does not exist")
        directory = "./database/member/"
        for filename in os.listdir(directory):
            if filename.endswith(".pkl"):
                file_path = os.path.join(directory, filename)  # Get the full path of the file
                os.remove(file_path)  # Remove the file
                print(f"Removed: {file_path}")

        return jsonify({'message': f'Successfully deleted person with PID {pid}'})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)})
@app.route('/removeImg', methods=['POST'])
def removeImg():
    try:
        data = request.json
        imgPath = data.get('imgPath')
        if os.path.exists(imgPath):
            os.remove(imgPath)
            return jsonify({'message': 'Image removed successfully'}), 200
        else:
            return jsonify({'dont find img'}),400
            

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500
    
#Machine learning
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


        #IMG DETECT
        emotion_result = DeepFace.analyze(img_path=FullImg_save_path, detector_backend='opencv', actions=['emotion'])
        results = []
        for entry in emotion_result:
            # Load image
            image = Image.open(FullImg_save_path)

            # Extract face region
            x, y, w, h = entry['region']['x'], entry['region']['y'], entry['region']['w'], entry['region']['h']
            face_region = image.crop((x, y, x + w, y + h))
            
            # Generate a unique filename for each face
            unique_filename = str(uuid.uuid4()) + '.jpg'
            folder_path = './database/faces/'
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
            small_img_save_path = os.path.join(folder_path, unique_filename)

            # Save the cropped face region to the specified folder
            face_region.save(small_img_save_path)
            
            # Convert the small image to base64
            with open(small_img_save_path, "rb") as image_file:
                base64_image = base64.b64encode(image_file.read()).decode('utf-8')

            dominant_emotion = entry['dominant_emotion']

            #find member
            db_path='./database/member/'
            if not os.path.exists(db_path):
                os.makedirs(db_path)
            person_name_result = DeepFace.find(img_path=small_img_save_path, db_path=db_path, enforce_detection=False)
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
                    person_pid = None
            else:
                person_name = "Unknown"
                person_pid = None
            print(person_name)
            mycursor.execute('SELECT emotion_data.emotion_id,emotion_data.emotion_data,response_text.response_text FROM `emotion_data` JOIN response_text ON emotion_data.emotion_id = response_text.emotion_id WHERE emotion_data.emotion_data = %s', (dominant_emotion,))
            emotion_data_result = mycursor.fetchone()
            print(dominant_emotion)
            # print(emotion_data_result)
            response_text = emotion_data_result['response_text']
            print(response_text)
            # Insert the new user into the database
            emotion_id = emotion_data_result['emotion_id']
            print(emotion_id)
            current_datetime = datetime.now()
            date_mysql_format = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
            mycursor.execute("INSERT INTO data_info (pid, emotion_id, DateTime, Full_path, Cut_path) VALUES (%s, %s, %s, %s, %s)",
                            (person_pid, emotion_id, date_mysql_format, FullImg_save_path, small_img_save_path))
            mydb.commit()
            
            results.append({
                    'dominant_emotion': dominant_emotion,
                    'person_name': person_name,
                    'response_text': response_text,
                    'base64_image': base64_image
            })
        # print(results)
        return jsonify(results),200

    except Exception as e:
        print("error",e)
        return jsonify({'error': str(e), 'dominant_emotion': "Error", 'person_name': 'unknown','response_text': 'หาไม่เจอ'}), 404



## MAIN ##
if __name__ == "__main__":
    #app.run(debug=True)
    app.run(host="0.0.0.0", port=3001,debug=True)
    