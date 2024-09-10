# Use an official Node.js runtime as a parent image ----- docker build -t taiefhilali/quickbiteimage .----
FROM node:21

# Set the working directory in the container
WORKDIR /backend/src/index

# Copy package.json and package-lock.json
COPY /package*.json ./

# RUN  npm install -g npm@10.8.3
# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on 
EXPOSE 7000

# Command to run the application
CMD ["npm", "run", "dev"]
