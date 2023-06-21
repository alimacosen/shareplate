# s23-t2-shareplate-backend
## Getting Started
### Docker (Recommended)
1. Create a `.env` file in the root directory of the project. See the [Environment Variables](#environment-variables) section for more information.
2. Run the following command to start the server
```bash
docker-compose up -d
```
### Local Machine
1. Create a `.env` file in the root directory of the project. See the [Environment Variables](#environment-variables) section for more information.
1. Install dependencies
```bash
npm install
```
1. Run the server
```bash
npm run start
```
## Environment Variables
Please check if the following environment variables are set in the `.env` file. If you need a template, please check `.env.defaults`.
| Key           | Description            | Default |
| ------------- | ---------------------- | ------- |
| DB_CONNECTION | MongoDB connection url | N/A     |
| JWT_SECRET    | JWT secret key         | N/A     |
