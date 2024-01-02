# Use the official Python image as the base image
FROM python:3.11.5

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install dependencies
# RUN pip install --no-cache-dir -r requirements.txt
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt --verbose

# Copy the rest of the application code
COPY . .

# Expose the port on which the Flask app will run (adjust as per your Flask app configuration)
EXPOSE 5000

# Start the application
CMD ["python", "server.py"]
