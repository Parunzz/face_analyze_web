# Use an official Node.js image with npm
FROM node:21-alpine3.18

# Set the working directory in the container
WORKDIR /usr/src/kiosk

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install 

# Copy the rest of the application code to the working directory
COPY . .

# For development server (replace "dev" with your actual script)
CMD ["npm", "run", "dev"]