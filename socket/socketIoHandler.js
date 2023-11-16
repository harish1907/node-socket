const productSchema = require("../models/product.models")

const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("A user connected");

    io.emit("allData", await productSchema.find({}));

    socket.on("join trade", tradeId => {
      console.log('tradeId', tradeId)
      socket.join(tradeId);

      socket.on("filterDataGet", async (data) => {
        console.log('data', data)
        setInterval(async () => {
          socket.emit(
            "filterDataSend",
            await productSchema.find({ name: { $in: data.identifier } })
          );
        }, 1000);
      });
    })

    // Set up a disconnect event
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketHandler;
