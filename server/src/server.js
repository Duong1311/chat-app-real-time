/* eslint-disable no-console */
// Author: TrungQuanDev: https://youtube.com/@trungquandev

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "~/config/corsOptions";
import { APIs_V1 } from "~/routes/v1/";
import { connectDB } from "~/config/connectDb";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import dotenv from "dotenv";
import http from "http";
import socketIo from "socket.io";
dotenv.config();

const START_SERVER = () => {
  // Init Express App
  const app = express();

  // Fix Cache from disk from ExpressJS
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  // Use Cookie
  app.use(cookieParser());

  // Allow CORS: for more info, check here: https://youtu.be/iYgAWJ2Djkw
  app.use(cors(corsOptions));

  // Enable req.body json data
  app.use(express.json());

  // Use Route APIs V1
  app.use("/v1", APIs_V1);

  // Connect to MongoDB
  connectDB();

  // error handing
  app.use(errorHandlingMiddleware);

  // server for socket.io
  const server = http.createServer(app);
  const io = socketIo(server, { cors: corsOptions });
  io.on("connection", (socket) => {
    // console.log("New client connected " + socket.id);
    socket.on("join chat", (rooms) => {
      rooms?.forEach((room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
      });
    });
    // socket.on("leave chat", (room) => {
    //   socket.leave(room);
    //   console.log(`User left chat: ${room}`);
    // });
    socket.on("disconnect", () => {
      console.log("A user disconnected " + socket.id);
    });

    socket.on("new message", (newMessageRecieved) => {
      // console.log(newMessageRecieved);
      //gui cho tat ca moi nguoi ke ca ban than
      // io.sockets.emit("BE_MES_REV", newMessageRecieved);

      // chi gui cho ban than
      // socket.emit("BE_MES_REV", newMessageRecieved);

      //gui cho tat ca moi nguoi trong room tru nguoi gui
      // socket.broadcast.emit("BE_MES_REV", newMessageRecieved);
      //gui trong rom
      socket
        .to(newMessageRecieved.chatId._id)
        .emit("BE_MES_REV", newMessageRecieved);

      //io là kiểu to hơn socket, có thể gửi tin nhắn tới tất cả các room, thành viên kể cả người gửi
      //socket là kiểu gửi tin nhắn tới room cụ thể, không gửi tin nhắn tới người gửi
    });
  });
  server.listen(
    process.env.LOCAL_DEV_APP_PORT,
    process.env.LOCAL_DEV_APP_HOST,
    () => {
      console.log(
        `Local DEV: Hello ${process.env.AUTHOR}, Back-end Server is running successfully at Host: ${process.env.LOCAL_DEV_APP_HOST} and Port: ${process.env.LOCAL_DEV_APP_PORT}`
      );
    }
  );
};

(async () => {
  try {
    // Start Back-end Server
    console.log("Starting Server...");
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
