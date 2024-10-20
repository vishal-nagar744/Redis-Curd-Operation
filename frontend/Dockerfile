# Base image
FROM node

# Set working directory
WORKDIR /notification

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port Vite uses (default is 5173)
EXPOSE 5173

# Command to start the Vite dev server
CMD ["npm", "run", "dev"]
