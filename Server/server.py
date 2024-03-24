from flask import Flask, request, jsonify, make_response, session, redirect, url_for,send_from_directory, url_for
from flask_cors import CORS
import json
import mysql.connector.pooling
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
import io
from flask_mail import Mail, Message



app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'  # Update with your SMTP server
app.config['MAIL_PORT'] = 587  # Update with your SMTP port
app.config['MAIL_USE_TLS'] = True  # Use TLS instead of SSL
app.config['MAIL_USERNAME'] = 's6404062663223@email.kmutnb.ac.th'  # Update with your email username
# app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASSWORD')  # use this command in terminal => set EMAIL_PASSWORD='your_email_password'
app.config['MAIL_PASSWORD'] = ''  # use this command in terminal => set EMAIL_PASSWORD='your_email_password'


mail = Mail(app)
CORS(app, supports_credentials=True)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Update the origin


## FOR DEV ENV ###
# conn = mysql.connector.connect(host="localhost",user="root",password="",db="deepface",connect_timeout=100)
### FOR Docker ###
#conn = mysql.connector.connect(host="db",user="admin",password="admin",db="deepface",connect_timeout=10000)
### FOR NETWORK
# conn = mysql.connector.connect(host="192.168.1.53",user="zen",password="zen",db="deepface",connect_timeout=100)
# conn = mysql.connector.connect(host="192.168.1.33",user="zen",password="admin",db="deepface",connect_timeout=100)
# cursor = conn.cursor(dictionary=True)

# MySQL connection pool 
# start only kiosk docker-compose up -d flask-server kiosk
# dbconfig = {
#     "host": "db",
#     "user": "admin",
#     "password": "admin",
#     "database": "deepface",
#     "connect_timeout": 10
# } 
#network docker db
# dbconfig = {
#     "host": "192.168.1.33",
#     "port":"9906",
#     "user": "admin",
#     "password": "admin",
#     "database": "deepface",
#     "connect_timeout": 10
# }
#local
# dbconfig = {
#     "host": "localhost",
#     "user": "root",
#     "password": "",
#     "database": "deepface",
#     "connect_timeout": 10
# }
# Create a connection pool
connection_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **dbconfig)

def get_mysql_connection():
    """
    Get a connection from the connection pool
    """
    return connection_pool.get_connection()

def close_mysql_connection(conn, cursor=None):
    """
    Close MySQL connection and cursor (if provided)
    """
    if cursor:
        cursor.close()
    conn.close()
@app.route("/")
def index():
    return "Server"
@app.route("/send_email", methods=["POST"])
def send_email():
    try:
        # Get recipient and message data from request
        recipient_email = request.form.get("recipient_email")
        subject = request.form.get("subject")
        message_body = request.form.get("message_body")
        image_data_uri = request.form.get("image")
        print(recipient_email)
        print(subject)
        print(message_body)
        if image_data_uri:
            image_data = image_data_uri.split(',')[1]
            image_bytes = base64.b64decode(image_data)
        # print(os.environ.get('EMAIL_PASSWORD'))
        # Create a message
        msg = Message(subject, sender=app.config['MAIL_USERNAME'], recipients=[recipient_email])
        msg.body = message_body
        if image_data_uri:
            msg.attach("image.png", "image/png", image_bytes)
        # Send the email
        mail.send(msg)
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
#database
@app.route('/register', methods=['POST'])
def Register():
    try:
        # # Connect to the database
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        # Get user data from the request
        data = request.json
        # print(data)
        Regusername = data.get('username')
        Regpassword = data.get('password')
        Regfirstname = data.get('firstName')
        Reglastname = data.get('lastName')

        # Check if the user already exists
        cursor.execute("SELECT * FROM user WHERE Username = %s", (Regusername,))
        existing_user = cursor.fetchone()

        if existing_user:
            return make_response(jsonify({'message': 'User already exists'}), 400)

        # Insert the new user into the database
        cursor.execute("INSERT INTO user (Username, Password , FirstName , LastName) VALUES (%s, %s, %s, %s)", (Regusername, Regpassword , Regfirstname ,Reglastname))
        conn.commit()

        return make_response(jsonify({'message': 'User registered successfully'}), 200)

    except Exception as e:
        error_message = str(e)
        # print("Error: ",{error_message})
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        close_mysql_connection(conn, cursor)
@app.route('/AddMember', methods=['POST'])
def AddMember():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json
        # print(data)
        AddfirstName = data.get('firstName')
        AddlastName = data.get('lastName')
        Addgender = data.get('gender')
        Addmydate = data.get('mydate')
        image_data = data.get('imgUpload')

        # Check if the user already exists
        cursor.execute("SELECT * FROM person_info WHERE FirstName = %s AND LastName = %s;", (AddfirstName, AddlastName))
        existing_user = cursor.fetchone()

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
  
        DeepFace.find(img_path=member_path, db_path='./database/member/', enforce_detection=False, detector_backend='ssd', distance_metric='euclidean_l2',model_name="SFace")
        # Insert the new user into the database
        cursor.execute("INSERT INTO person_info (FirstName, LastName , gender , DateOfBirth, img_path) VALUES (%s, %s, %s, %s, %s);", (AddfirstName, AddlastName , Addgender ,formatted_date, folder_path))
        conn.commit()

        return make_response(jsonify({'message': 'Add Member successfully'}), 200)

    except Exception as e:
        error_message = str(e)
        print("Error: ",{error_message})
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        close_mysql_connection(conn, cursor)
    
@app.route('/UpdateMember', methods=['POST'])
def UpdateMember():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json
        AddfirstName = data.get('firstName')
        AddlastName = data.get('lastName')
        Addgender = data.get('gender')
        Addmydate = data.get('mydate')
        image_data = data.get('imgUpload')
        pid = int(data.get('pid'))
        date_object = datetime.strptime(Addmydate, '%m/%d/%Y')
        formatted_date = date_object.strftime('%Y-%m-%d')

        cursor.execute("SELECT FirstName FROM person_info WHERE pid = %s;", (pid,))

        FirstName = cursor.fetchone()

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
                
            DeepFace.find(img_path=member_path, db_path='./database/member/', enforce_detection=False, detector_backend='ssd', distance_metric='euclidean_l2',model_name="SFace")
        
        # Insert the new user into the database
        cursor.execute("UPDATE person_info SET FirstName = %s, LastName = %s, gender = %s, DateOfBirth = %s, img_path = %s WHERE pid = %s;", (AddfirstName, AddlastName, Addgender, formatted_date, new_folder_path, pid))
        conn.commit()
        

        return make_response(jsonify({'message': 'Add Member successfully'}), 200)

    except Exception as e:
        error_message = str(e)
        print("Error: ",{error_message})
        return make_response(jsonify({'error': str(e)}), 500)
    finally:
        close_mysql_connection(conn, cursor)

SECRET_KEY = 'zen'
@app.route('/login', methods=['POST'])
def signin():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json  # Assuming JSON data is sent from the frontend
        # print(data)
        username = data.get('username')
        password = data.get('password')

        # cursor.execute('SELECT Username, Password FROM user WHERE Username=%s AND Password=%s', (username, password))
        cursor.execute('SELECT Username, Password FROM user WHERE Username=%s AND Password=%s;', (username, password))

        user = cursor.fetchone()

        if user:
            # token = jwt.encode({'username': username}, SECRET_KEY, algorithm='HS256')
            # print(token)
            return jsonify({'Status': 'true'}), 200
        else:
            # Authentication failed
            return jsonify({'error': 'Invalid credentials'}), 401
   
    except Exception as e:
        error_message = str(e)
        return make_response(jsonify({'error': error_message}), 500)

    finally:
        close_mysql_connection(conn, cursor)
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
@app.route('/DashBoardGender', methods=['POST'])
def DashBoardGender():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json
        pickdate = data.get('pickdate')
        date_object = datetime.strptime(pickdate, '%Y-%m-%d')
        formatted_date = date_object.strftime('%Y-%m-%d')
        # print(formatted_date)
        # Fetch member details
        cursor.execute('''
            SELECT 
                Gender, 
                DATE_FORMAT(DateTime, '%Y-%m-%d %H:00:00') AS HourlyDateTime,
                COUNT(DateTime) AS Count 
            FROM 
                data_info 
            WHERE 
                DATE(DateTime) = %s 
            GROUP BY 
                DATE_FORMAT(DateTime, '%Y-%m-%d %H:00:00'), Gender;
        ''', (formatted_date,))
        data = cursor.fetchall()
        return jsonify(data), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        close_mysql_connection(conn, cursor)

@app.route('/Map', methods=['POST'])
def Map():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json
        pid = int(data.get('pid'))
        pickdate = data.get('pickdate')
        date_object = datetime.strptime(pickdate, '%Y-%m-%d')
        formatted_date = date_object.strftime('%Y-%m-%d')
        print(formatted_date)
        # Fetch member details
        cursor.execute('SELECT place FROM data_info WHERE pid = %s AND DATE(DateTime) = %s;', (pid, formatted_date))
        place = cursor.fetchall()

        print(place)
        return jsonify(place), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        close_mysql_connection(conn, cursor)
    
@app.route('/Memberdetail', methods=['POST'])
def Memberdetail():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json
        pid = int(data.get('pid'))
        
        # Fetch member details
        cursor.execute('SELECT * FROM person_info WHERE pid = (%s);', (pid,))
        member_info = cursor.fetchall()

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
    finally:
        close_mysql_connection(conn, cursor)
    
@app.route('/emotion_data',methods=['POST'])
def get_emotion_data():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json
        pickdate = data.get('pickdate')
        date_object = datetime.strptime(pickdate, '%Y-%m-%d')
        formatted_date = date_object.strftime('%Y-%m-%d')
        # print(formatted_date)
        cursor.execute("SELECT emotion_data.emotion_data, COUNT(data_info.emotion_id) AS count FROM emotion_data LEFT JOIN data_info ON emotion_data.emotion_id = data_info.emotion_id WHERE DATE(DateTime) = %s GROUP BY emotion_data.emotion_data;",(formatted_date,))
        emotion_data = cursor.fetchall()
        return jsonify(emotion_data)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)})
    finally:
        close_mysql_connection(conn, cursor)

@app.route('/CountMembers',methods=['POST'])
def get_CountMembers():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json
        pickdate = data.get('pickdate')
        date_object = datetime.strptime(pickdate, '%Y-%m-%d')
        formatted_date = date_object.strftime('%Y-%m-%d')
        
        cursor.execute("SELECT CASE WHEN Name = 'unknown' THEN 'unknown' ELSE 'member' END AS Name, COUNT(*) AS Count FROM data_info WHERE DATE(DateTime) = %s GROUP BY CASE WHEN Name = 'unknown' THEN 'unknown' ELSE 'member' END;",(formatted_date,))
        CountMembers = cursor.fetchall()
        return jsonify(CountMembers)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)})
    finally:
        close_mysql_connection(conn, cursor)
@app.route('/getMember', methods=['GET'])
def getMember():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('SELECT FirstName,LastName,pid FROM person_info;')
        data = cursor.fetchall()
        return make_response(jsonify({'Member': data }), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)})
    finally:
        close_mysql_connection(conn, cursor)
    
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
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json
        pid = data.get('pid')

        # Check if the person with the given PID exists before deleting
        cursor.execute('SELECT * FROM person_info WHERE pid = %s;', (pid,))
        person = cursor.fetchone()

        if not person:
            return jsonify({'error': f'Person with PID {pid} not found'})

        # Get the filename or path of the associated image
        image_filename = person['img_path'] 
        folder_path = f'./database/member/{person["FirstName"]}/'
        # Perform deletion from the database
        cursor.execute('DELETE FROM person_info WHERE `person_info`.`pid` = %s;', (pid,))
        conn.commit()
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
    finally:
        close_mysql_connection(conn, cursor)

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

#transaction
@app.route('/api/transaction', methods=['GET'])
def Transaction():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        page = int(request.args.get('page', 0))
        rows_per_page = int(request.args.get('rowsPerPage', 10))

        # Calculate offset based on page number and rows per page
        offset = page * rows_per_page

        # Fetch data from database with pagination
        # cursor.execute('SELECT * FROM data_info LIMIT %s OFFSET %s', (rows_per_page, offset))
        # cursor.execute('SELECT data_info.Data_id,data_info.Name,data_info.Gender,data_info.Age,data_info.DateTime,emotion_data.emotion_data,data_info.place FROM `data_info` JOIN emotion_data ON data_info.emotion_id = emotion_data.emotion_id ORDER BY data_info.DateTime DESC LIMIT %s OFFSET %s;', (rows_per_page, offset))
        cursor.execute('SELECT data_info.Data_id,data_info.Name,data_info.Gender,data_info.Age,data_info.DateTime,emotion_data.emotion_data,data_info.place FROM `data_info` JOIN emotion_data ON data_info.emotion_id = emotion_data.emotion_id ORDER BY data_info.DateTime DESC;')
        data = cursor.fetchall()
        
        return make_response(jsonify(data), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500
    finally:
        close_mysql_connection(conn, cursor)
#get emotion text
@app.route('/api/GetEmotion', methods=['GET'])
def GetEmotion():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute('SELECT emotion_data,emotion_id FROM `emotion_data` ;')
        data = cursor.fetchall()
        
        return make_response(jsonify(data), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500
    finally:
        close_mysql_connection(conn, cursor)
        
@app.route('/api/ResponseText', methods=['POST'])
def ResponseText():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        emotion_id = request.form.get('emotion_id')
        cursor.execute('SELECT response_text.response_text, emotion_data.emotion_data, response_text_id FROM `response_text` JOIN emotion_data ON response_text.emotion_id = emotion_data.emotion_id WHERE response_text.emotion_id = %s;',(emotion_id,))
        data = cursor.fetchall()
        return make_response(jsonify(data), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500
    finally:
        close_mysql_connection(conn, cursor)
        
@app.route('/api/SetResponseText', methods=['POST'])
def SetResponseText():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        request_data = request.json
        response_text = request_data.get('ResponseText')
        emotion_id = int(request_data.get('emotion_id'))
    
        cursor.execute('INSERT INTO response_text (emotion_id, response_text) VALUES (%s, %s)', (emotion_id, response_text,))
        conn.commit()  # Commit changes to the database
        return make_response(jsonify({'message': 'Data inserted successfully'}), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500
    finally:
        close_mysql_connection(conn, cursor)

@app.route('/api/removeResponseText/<int:response_text_id>', methods=['DELETE'])
def delete_response_text(response_text_id):
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("DELETE FROM response_text WHERE response_text_id = %s", (response_text_id,))
        conn.commit()
        return jsonify({'message': 'Response text deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        close_mysql_connection(conn, cursor)
    
@app.route('/api/TransactionDetail',methods=['POST'])
def TransactionDetail():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        json_data = request.get_json()
        Data_id = int(json_data.get('Data_id'))
        # print(Data_id)
        # cursor.execute('SELECT * FROM `data_info` JOIN emotion_data ON data_info.emotion_id = emotion_data.emotion_id WHERE Data_id = %s;',(Data_id,))
        cursor.execute('SELECT data_info.Name,data_info.Gender,data_info.Age,data_info.DateTime,data_info.Full_path,data_info.Cut_path,data_info.place,emotion_data.emotion_data FROM `data_info` JOIN emotion_data ON data_info.emotion_id = emotion_data.emotion_id WHERE Data_id = %s;',(Data_id,))
        data = cursor.fetchall()
        data_row = data[0]  # Assuming there's only one row in the data list
        full_path = data_row['Full_path']
        cut_path = data_row['Cut_path']
        # print(data_row)
        # Open and read the image files
        with open(full_path, "rb") as img_file1, open(cut_path, "rb") as img_file2:
            img_data1 = img_file1.read()
            img_data2 = img_file2.read()  
            # Encode the image data as Base64
            base64_img1 = base64.b64encode(img_data1).decode('utf-8')  # Convert bytes to string
            base64_img2 = base64.b64encode(img_data2).decode('utf-8')  # Convert bytes to string
            
            # Construct the JSON response
            response_data = {
                "Data_id": Data_id,
                "Full_Img": base64_img1,
                "Cut_Img": base64_img2,
                "Data":data_row
            }
        return make_response(jsonify(response_data), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500
    finally:
        close_mysql_connection(conn, cursor)
    
@app.route('/api/FindPerson',methods=['POST'])
def FindPerson():
    try:
        json_data = request.get_json()
        Data_id = int(json_data.get('Data_id'))
        base64_string = json_data.get('FaceImg')
        image = f"data:image/png;base64,{base64_string}"
        db_path = './database/full_img/'
        if not os.path.exists(db_path):
            os.makedirs(db_path)
        find_result = DeepFace.find(img_path=image, db_path=db_path, enforce_detection=False, detector_backend='opencv', distance_metric='euclidean_l2',model_name="SFace")
        # print('Path : ',find_result)
        if not find_result[0].empty:
            img_paths = find_result[0]['identity'].tolist() 
            first_10_img_paths = img_paths[:10]
            # print('name',img_path)
        else:
            img_paths = []
        base64_images = []
        for img_path in first_10_img_paths:
            with open(img_path, "rb") as img_file:
                base64_image = base64.b64encode(img_file.read()).decode("utf-8")
                base64_images.append(base64_image)
        response_data = {
            'find_result':base64_images
        }
        return make_response(jsonify(response_data), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500
    
@app.route('/api/Update',methods=['POST'])
def UpdateModel():
    try:
        json_data = request.get_json()
        Data_id = int(json_data.get('Data_id'))
        base64_string = json_data.get('FaceImg')
        image = f"data:image/png;base64,{base64_string}"
        db_path = './database/full_img/'
        if not os.path.exists(db_path):
            os.makedirs(db_path)
        for filename in os.listdir(db_path):
                if filename.endswith(".pkl"):
                    file_path = os.path.join(db_path, filename)  # Get the full path of the file
                    os.remove(file_path)  # Remove the file
                    print(f"Removed: {file_path}")
        find_result = DeepFace.find(img_path=image, db_path=db_path, enforce_detection=False, detector_backend='opencv', distance_metric='euclidean_l2',model_name="SFace")
        # print('Path : ',find_result)
        if not find_result[0].empty:
            img_paths = find_result[0]['identity'].tolist() 
            first_10_img_paths = img_paths[:10]
            # print('name',img_path)
        else:
            img_paths = []
        base64_images = []
        for img_path in first_10_img_paths:
            with open(img_path, "rb") as img_file:
                base64_image = base64.b64encode(img_file.read()).decode("utf-8")
                base64_images.append(base64_image)
        response_data = {
            'find_result':base64_images
        }
        return make_response(jsonify(response_data), 200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500
        

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

@app.route('/api/save_img',methods=['POST'])
def save_img():
    try:
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)

        JSON = []
        json_data = request.get_json()
        responseData = json_data.get('responseData')
        place = json_data.get('place')
        print(place)
        for data in responseData:
            if data['NewPerson'] == 'True':
                # Extract base64 strings from JSON data
                image_base64 = data['full_image']
                face_img_base64 = data['face_image']
                # print(image_base64)
                # print(face_img_base64)

                # Decode base64 strings
                image_data = base64.b64decode(image_base64.split(',')[1])
                face_img_data = base64.b64decode(face_img_base64.split(',')[1])

                # Open images with PIL
                image = Image.open(BytesIO(image_data))
                face_img = Image.open(BytesIO(face_img_data))

                # Generate unique filenames using UUID
                unique_filename = str(uuid.uuid4()) + '.jpg'
                face_unique_filename = str(uuid.uuid4()) + '.jpg'

                # Save images to folder
                full_img_folder = './database/full_img/'
                if not os.path.exists(full_img_folder):
                    os.makedirs(full_img_folder)
                FullImg_save_path = os.path.join(full_img_folder, unique_filename)
                image.save(FullImg_save_path)

                face_img_folder = './database/face_img/'
                if not os.path.exists(face_img_folder):
                    os.makedirs(face_img_folder)
                faceImg_save_path = os.path.join(face_img_folder, face_unique_filename)
                face_img.save(faceImg_save_path)


                # emotion
                emotion_result = DeepFace.analyze(img_path=faceImg_save_path, detector_backend='opencv', actions=['emotion'],enforce_detection=False)
                dominant_emotion = emotion_result[0]['dominant_emotion']
                print(dominant_emotion)
                db_path='./database/member/'
                if not os.path.exists(db_path):
                    os.makedirs(db_path)
                person_name_result = DeepFace.find(img_path=faceImg_save_path, db_path=db_path, enforce_detection=False, detector_backend='opencv', distance_metric='euclidean_l2',model_name="SFace")
                if not person_name_result[0].empty:
                    person_name = person_name_result[0]['identity'][0].split('/')[3]
                    # print("Name : ",person_name)
                    cursor.execute('SELECT FirstName,gender,DateOfBirth, pid FROM person_info WHERE FirstName = %s;', (person_name,))
                    person_info = cursor.fetchone()
                    if person_info:
                        person_name = person_info['FirstName']
                        person_pid = person_info['pid']
                        person_gender = person_info['gender']
                        person_DateOfBirth = person_info['DateOfBirth']
                        
                        person_DateOfBirth = datetime.combine(person_DateOfBirth, datetime.min.time())
                        # Get the current datetime
                        current_datetime = datetime.now()
                        # Calculate the difference between current datetime and date of birth
                        age_timedelta = current_datetime - person_DateOfBirth
                        # Convert the timedelta to years (approximate)
                        person_age = int(age_timedelta.days / 365.25)
                        # print(person_age)
                    else:
                        person_name = "Unknown"
                        person_pid = None
                        person_gender = None
                        person_age = None
                else:
                    person_name = "Unknown"
                    person_pid = None
                    person_gender = None
                    person_age = None
                # print(person_name)
                cursor.execute(
                    '''
                        SELECT IMG_Emotion, emotion_data.emotion_id, emotion_data.emotion_data, response_text.response_text
                        FROM emotion_data
                        JOIN response_text ON emotion_data.emotion_id = response_text.emotion_id
                        WHERE emotion_data.emotion_data = %s
                        ORDER BY RAND()
                        LIMIT 1;
                    ''', (dominant_emotion,))
                emotion_data_result = cursor.fetchone()
                response_text = emotion_data_result['response_text']
                # print(response_text)

                img_emotion = emotion_data_result['IMG_Emotion']
                img_emotion_base64 = base64.b64encode(img_emotion).decode('utf-8')
                # Insert the new user into the database
                emotion_id = emotion_data_result['emotion_id']
                # print(img_emotion_base64)
                current_datetime = datetime.now()
                date_mysql_format = current_datetime.strftime('%Y-%m-%d %H:%M:%S')
                cursor.execute("INSERT INTO data_info (Name, Gender, Age, pid, emotion_id, DateTime, Full_path, Cut_path, place) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);",
                                (person_name, person_gender, person_age ,person_pid, emotion_id, date_mysql_format, FullImg_save_path, faceImg_save_path, place))
                conn.commit()

                results = {
                    'emotion_result':dominant_emotion,
                    'person_name': person_name,
                    'person_gender':person_gender,
                    'person_age':person_age,
                    'response_text': response_text,
                    'base64_image': face_img_base64,
                    'BLOB': img_emotion_base64
                }
                JSON.append(results)
        return jsonify(JSON),200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}),500   
    finally:
        close_mysql_connection(conn, cursor)

## MAIN ##
if __name__ == "__main__":
    #app.run(debug=True)
    app.run(host="0.0.0.0", port=3001,debug=True)
    