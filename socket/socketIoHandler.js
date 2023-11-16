const productSchema = require("../models/product.models")

const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("A user connected");

    io.emit("allData", await productSchema.find({}));

    socket.on("filterData", async (data) => {
      setInterval(async () => {
        socket.emit(
          "filterData",
          await productSchema.find({ name: { $in: data.identifier } })
        );
      }, 1000);
    });

    // Set up a disconnect event
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketHandler;
