# Cloud Video Streaming Service
 A video platform that allows users to upload video files, view and stream them.

## Table of Contents
- [Cloud Video Streaming Service](#cloud-video-streaming-service)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Technologies Used](#technologies-used)
  - [Contributors](#contributors)
  - [License](#license)
## Getting Started
1. Clone the repository
2. install the npm packages
```bash
npm install
```
3. Install ffmpeg binary

**For Linux user**
```bash
sudo apt-get update && sudo apt-get install ffmpeg
```
**For Mac user**
```bash
brew install ffmpeg
```
**For Windows user**
Download the binary from [here](https://ffmpeg.org/download.html)
4. Open backend/src/controllers/StreamController.ts and change the path to the ffmpeg binary by uncommenting the line that corresponds to your Operating System
```typescript
// linux
// ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');

// Windows
// ffmpeg.setFfmpegPath( "C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe" );

// Mac
// ffmpeg.setFfmpegPath('/usr/local/bin/ffmpeg');
```
5. Configure the .env files for the backed and frontend according to the example.env files.
**Backend .env file**
```bash
# My Atlas Credentials
DB_CONN_STRING='your connection string to the mongodb server(Atlas)'
DB_NAME='your database name'
DB_COLLECTION='your database collection name'
DB_PORT='your database port'
PORT='your server port'
SERVER_HOST='your server host'
DB_HOST='your database host in case for local database'
DB_USER='your database user in case for local database'
DB_PASSWORD='your database password in case for local database'
NODE_ENV='your node environment'
AWS_ACCESS_KEY_ID='your aws access key id'
AWS_SECRET_ACCESS_KEY='your aws secret access key'
AWS_BUCKET_NAME='your aws bucket name'
S3_REGION='your s3 region'
CONSOLE_SIGNIN_URL='your console sign in url(optional)'
GOOGLE_OAUTH_CLIENT_ID='your google oauth client id'
GOOGLE_OAUTH_CLIENT_SECRET='your google oauth client secret'
GOOGLE_OAUTH_REDIRECT='your google oauth redirect url'
JWT_SECRET='your jwt secret'
TOKEN_EXPIRES_IN=60
FRONTEND_ENDPOINT=http://localhost:3000
DEFAULT_THUMBNAIL=http://localhost:8000/api/v1/thumbnails/default.png
```
**Frontend .env file**
```bash
VITE_BACKEND_ENDPOINT=http://localhost:8000/api/v1

VITE_GOOGLE_OAUTH_CLIENT_ID='GOOGLE_OAUTH_CLIENT_ID'
VITE_GOOGLE_OAUTH_CLIENT_SECRET='GOOGLE_OAUTH_CLIENT_SECRET'
VITE_GOOGLE_OAUTH_REDIRECT=<http://localhost:8000/api/v1/sessions/oauth/google>
```
6. Run the backend server - make sure you are in the respective directory
```bash
npm run start
```
7. Run the frontend server
```bash
npm run start
```
8. Open your browser and go to http://localhost:3000

## Technologies Used
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [FFmpeg](https://ffmpeg.org/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Vite](https://vitejs.dev/)
- [JSON Web Tokens](https://jwt.io/)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Redis](https://redis.io/)

## Contributors
- [Emmanuel Chalo](Chalo1996.github.io) || [Email](mailto:emusyoka759@gmail.com)
- [Nick Nyanjui](n1klaus.github.io) || [Email](mailto:hanichris71@gmail.com)
- [Chris Nyambane](hanichris.github.io) || [Email](mailto:nicknyanjui@gmail.com)

## License
[MIT](https://choosealicense.com/licenses/mit/)
