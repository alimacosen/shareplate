FROM node:16-slim
EXPOSE 3000
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy the app
COPY . .

# Start the app
CMD ["npm", "start"]