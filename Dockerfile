# Use the official Node.js LTS image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port your Nest.js application is running on (default is 3000)
EXPOSE 3000

# Define the command to start your Nest.js application
CMD ["pnpm", "start"]