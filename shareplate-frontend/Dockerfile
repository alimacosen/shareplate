FROM node:16-slim
EXPOSE 4173

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json .
RUN yarn

# Copy the source code
COPY . .

# Build the app
RUN yarn build

# Run the app
CMD ["yarn", "preview", "--", "--host"]
