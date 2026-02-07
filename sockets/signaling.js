export default function setupSignaling(io) {

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      const clients = io.sockets.adapter.rooms.get(roomId);
      const numberOfClients = clients ? clients.size : 0;

      console.log("Room:", roomId, "Users:", numberOfClients);

      // If more than 1 user in room → viewer joined
      if (numberOfClients > 1) {
        console.log("Notifying broadcaster to send offer");
        socket.to(roomId).emit("ready-for-offer");
      }
    });

    socket.on("offer", ({ roomId, offer }) => {
      console.log("Forwarding offer to room:", roomId);
      socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", ({ roomId, answer }) => {
      console.log("Forwarding answer to room:", roomId);
      socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", candidate);
    });

    socket.on("fire-detection", ({ roomId, result }) => {
      socket.to(roomId).emit("fire-detection", { result });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
