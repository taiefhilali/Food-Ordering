#  FROM node:21
# Use an appropriate Node.js version
FROM node:18

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application (if necessary)
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

# # Set the working directory in the container
# WORKDIR /frontend

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies with specific versions


# # Install additional packages (if required)
# # Make sure to use compatible versions
# # RUN npm install react-chartjs-2@5.2.0 react-chat-elements@12.0.16 react-chat-ui@0.4.0 react-facebook-login@4.1.1 --force
# # RUN npm install core-js@3.23.3 --force

# # # Install the latest npm version compatible with the Node version
# # RUN npm install -g npm@^3.0.0 --force
# RUN npm install --legacy-peer-deps

# # Copy the rest of the application code
# COPY . .

# # Expose the port that the app runs on
# EXPOSE 3000

# # Command to run the application
# CMD ["npm", "run", "dev"]
