# 1. Grab a lightweight version of Node.js as our base operating system
FROM node:20-alpine

# 2. Tell Docker to do all its work inside a folder called /app
WORKDIR /app

# 3. Copy only the package files first (this is a pro-tier caching trick!)
COPY package*.json ./

# 4. Install the dependencies
RUN npm install

# 5. Copy the rest of your backend code into the container
COPY . .

# 6. Open up the port your server runs on (usually 5000)
EXPOSE 5000

# 7. The command to start your app
CMD ["node", "index.js"]