FROM node:21

# Set the working directory in the container
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with specific versions
RUN npm install --force

# Install additional packages (if required)
# Make sure to use compatible versions
RUN npm install react-chartjs-2@5.2.0 react-chat-elements@12.0.16 react-chat-ui@0.4.0 react-facebook-login@4.1.1 --force
RUN npm install core-js@3.23.3 --force

# Install the latest npm version compatible with the Node version
RUN npm install -g npm@10.8.3 --force

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
