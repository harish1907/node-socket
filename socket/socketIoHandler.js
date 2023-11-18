const productSchema = require("../models/product.models");

const socketHandler = (io) => {
  // Store intervals and other information for each connected user
  const userIntervals = {};

  io.on("connection", async (socket) => {
    console.log("A user connected");

    socket.on("allDataGet", () => {
      console.log('socket.id', socket.id)
      const allDataInterval = setInterval(async () => {
        io.to(socket.id).emit("allData", await productSchema.find({}));
      }, 1000);
      userIntervals[socket.id] = allDataInterval;
    })

    socket.on("filterDataGet", async (data) => {
      const filterDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "filterDataSend",
          await productSchema.find({ name: { $in: data.identifier } })
        );
      }, 1000);
      userIntervals[socket.id] = filterDataInterval;
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      clearInterval(userIntervals[socket.id]);
      delete userIntervals[socket.id];
    });
  });
};

module.exports = socketHandler;
