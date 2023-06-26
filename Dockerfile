FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 27017

# Environment variables for MongoDB
ENV MONGO_HOST='127.0.0.1'
ENV MONGO_PORT=27017
ENV MONGO_DBNAME=PraanTask

# Start the application
CMD ["npm", "start"]
