# AmahaneChat - Socket Server

# Description
This repository serves as the WebSocket server for Amahane Chat, a chat platform designed for anime and manga enthusiasts. The server is responsible for real-time messaging, handling WebSocket connections, and video call signaling.

# Features
- `User Management`: Keeps track of connected users.
- `Real-Time Messaging`: Allows text and sticker messages.
- `Conversation Management`: Supports the addition of new conversations.
- `Video Call`s: Manages signaling for peer-to-peer video calls.

# Technologies Used
- `Node.js`
- `Express`
- `Socket.io`

# Installation
Clone the Repository
```bash
git clone git@github.com:animedaisuki/so.amahanechat.git
```

Install Dependencies
Navigate to the project directory and run:
```bash
npm install
```

Edit the .env file to include necessary environment variables like SOCKET_PORT and CORS_ORIGIN.

Run the Server
To start the WebSocket server, navigate to the project directory and run:
```bash
npm start
```

The server should now be running and waiting for WebSocket connections on the specified port.

# Events Handled
- `addUser`: Adds a new user and their socket ID to a list of connected users.
- `sendMessage`: Handles sending messages between users.
- `addConversation`: Notifies users when a new conversation has been initiated.
- `callUser`: Handles the initial signaling for a video call.
- `answerCall`: Manages the handshake between the calling parties.
- `declineCall`: Handles a call being declined.
- `leaveCall`: Manages the process when a user leaves a call.
- `disconnect`: Removes users from the list when they disconnect.

# License
MIT License
