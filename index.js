const config = require("./src/app/config/config");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: config.origin } });

app.use(express.static(__dirname + "../../build"));

let users = {};
const addUsers = (userId, socketId) => {
  users[userId] = socketId;
};
const removeUsers = (socketId) => {
  const copyOfUsers = { ...users };
  for (const userId in copyOfUsers) {
    if (copyOfUsers[userId] === socketId) {
      delete users[userId];
      return userId;
    }
  }
};
const findReceiver = (userId) => {
  return users[userId];
};

let videoTalks = [];

const addVideoTalks = (senderId, receiverId) => {
  videoTalks.push([senderId, receiverId]);
};

const checkIfIsBusy = (userId) => {
  const result = videoTalks.find((subArray) => {
    return subArray.includes(userId);
  });
  if (result) {
    return result.length !== 0;
  } else {
    return false;
  }
};

const removeVideoTalks = (userId) => {
  const filteredVideoTalks = videoTalks.filter((subArray) => {
    return !subArray.includes(userId);
  });
  videoTalks = filteredVideoTalks;
};

const findOtherUserInVideoTalks = (userId) => {
  if (findOtherUserInVideoTalks.length > 0) {
    const filteredVideoTalks = videoTalks.filter((subArray) => {
      return subArray.includes(userId);
    });
    if (filteredVideoTalks.length > 0) {
      const anotherUserId = filteredVideoTalks[0].filter((id) => id !== userId);
      return anotherUserId[0];
    }
    return null;
  }
  return null;
};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("addUser", (userId) => {
    addUsers(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const { senderId, receiverId, text, isSticker } = data;
    const receiver = findReceiver(receiverId);
    if (receiver) {
      senderId._id = senderId.id;
      io.to(receiver).emit("getMessages", {
        senderId,
        text,
        isSticker,
      });
    }
  });

  socket.on("addConversation", (data) => {
    const { receiverId, newConversation } = data;
    const receiver = findReceiver(receiverId);
    if (receiver) {
      io.to(receiver).emit("getArrivalConversation", {
        newConversation,
      });
    }
  });

  socket.on("callUser", (data) => {
    const { senderId, receiverId } = data;
    const isBusy = checkIfIsBusy(receiverId);
    if (!isBusy) {
      addVideoTalks(senderId, receiverId);
      const receiver = findReceiver(receiverId);
      if (receiver) {
        io.to(receiver).emit("incomingCall", data);
      }
    } else {
      io.to(socket.id).emit("callIsBusy");
    }
  });

  socket.on("answerCall", (data) => {
    const { senderId, signalData } = data;
    const initiator = findReceiver(senderId);
    console.log("answered");
    socket.to(initiator).emit("callAccepted", signalData);
  });

  socket.on("declineCall", (data) => {
    const senderId = data;
    const initiator = findReceiver(senderId);
    removeVideoTalks(senderId);
    io.to(initiator).emit("callDeclined");
  });

  socket.on("leaveCall", (userId) => {
    const anotherUserId = findOtherUserInVideoTalks(userId);
    if (anotherUserId) {
      const socketId = findReceiver(anotherUserId);
      io.to(socketId).emit("callLeaved");
    }
    removeVideoTalks(userId);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    const userId = removeUsers(socket.id);
    io.emit("getUsers", users);
    const anotherUserId = findOtherUserInVideoTalks(userId);
    if (anotherUserId) {
      const socketId = findReceiver(anotherUserId);
      io.to(socketId).emit("callEnded");
    }
    removeVideoTalks(userId);
  });
});

server.listen(config.socket_port, () => {
  console.log(`socket server is running at ${config.socket_port}`);
});
