## YouTube Clone

This is a YouTube clone built using React, Redux, Node, Express, and MongoDB. It has features like user authentication, video uploading, playlists, subscriptions, comments, and more.

### Prerequisites

- Node.js installed on your system.
- A MongoDB database.
- A Firebase project.

### Setup

1. Clone the repository.
2. Install the dependencies by running `npm install`.
3. Create a `.env` file in the root directory and add your MongoDB connection string and Firebase credentials.
4. Start the development server by running `npm start`.
5. Open `http://localhost:3000` in your browser.

### Code Structure

The codebase is organized into the following directories:

- `client/`: Contains the React frontend code.
- `server/`: Contains the Node.js backend code.
- `public/`: Contains static assets like images and CSS files.

### Client Code

The client code is written in React and uses the following libraries:

- `react`: The main React library.
- `react-redux`: Redux bindings for React.
- `redux`: The Redux state management library.
- `axios`: A library for making HTTP requests.
- `react-router-dom`: A library for routing in React.
- `react-toastify`: A library for showing toast notifications.
- `font-awesome`: A library for using Font Awesome icons.

### Server Code

The server code is written in Node.js and uses the following libraries:

- `express`: A web framework for Node.js.
- `mongoose`: A MongoDB ODM for Node.js.
- `cors`: A library for enabling CORS.
- `cookieParser`: A library for parsing cookies.
- `dotenv`: A library for loading environment variables.
