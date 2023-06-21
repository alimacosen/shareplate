# s23-t2-shareplate-frontend
## Getting Started
### Docker (Recommended)
1. Create a `.env` file in the root directory of the project. See the [Environment Variables](#environment-variables) section for more information.
2. Run the following command to start the server
```bash
docker-compose up -d
```
### Local Machine
1. Install dependencies
```bash
yarn
```
2. Create a `.env` file in the root directory of the project. See the [Environment Variables](#environment-variables) section for more information.
3. Start development server
```bash
yarn dev
```
## Environment Variables
Please use the `.env.defaults` file as a template for your `.env` file. The `.env.defaults` file contains all the environment variables that are required for the application to run.
| Key                     | Description                | Default Value |
| ----------------------- | -------------------------- | ------------- |
| VITE_API_ENDPOINT       | The URL of the backend API | N/A           |
| VITE_SOCKET_ENDPOINT    | The URL of the socket API  | N/A           |
| VITE_GOOGLE_MAP_API_KEY | THE API key of Google Maps | N/A           |
