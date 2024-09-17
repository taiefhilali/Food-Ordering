# Use an official Node.js runtime as a parent image ----- docker build -t taiefhilali/quickbiteimage .----
    FROM node:21

    # Set the working directory in the container
    WORKDIR /frontend
    
    # Copy package.json and package-lock.json
    COPY /package*.json ./
    RUN npm install react-chartjs-2@latest react-chat-elements@latest react-chat-ui@latest react-facebook-login@latest --force

    RUN npm install core-js@latest --force

     RUN  npm install -g npm@10.8.3 --force
    RUN npm install react-lottie@latest --force
    # RUN  npm install -g npm@10.8.3 --force
    # Install dependencies
    RUN npm install --force
    
    # Copy the rest of the application code
    COPY . .
    
    # Expose the port that the app runs on 
    EXPOSE 3000
    
    # Command to run the application
    CMD ["npm", "run", "dev"]
    