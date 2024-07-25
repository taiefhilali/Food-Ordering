# Backend Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /backend/src/index

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY backend/ .

# Expose the port that the app runs on
EXPOSE 7000

# Command to run the application
CMD ["npm", "run", "dev"]