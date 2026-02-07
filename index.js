import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import setupSignaling from "./sockets/signaling.js";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setupSignaling(io);

server.listen(5000, () => {
  console.log("Streaming signaling server running on port 5000");
});
