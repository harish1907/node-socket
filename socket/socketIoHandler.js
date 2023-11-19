const productSchema = require("../models/product.models");

const socketTestCase = (io) => {
  const userIntervals = {
    allData: {},
    filterData: {},
    oneData: {},
  };

  io.on("connection", async (socket) => {
    console.log("A user connected");

    socket.on("allDataGet", () => {
      const allDataInterval = setInterval(async () => {
        io.to(socket.id).emit("allData", await productSchema.find({}));
      }, 1000);
      userIntervals.allData[socket.id] = allDataInterval;

      socket.on("allDataOff", () => {
        clearInterval(userIntervals.allData[socket.id]);
        delete userIntervals.allData[socket.id];
      });
    });

    socket.on("filterDataGet", async (data) => {
      const filterDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "filterDataSend",
          await productSchema.find({ name: { $in: data.identifier } })
        );
      }, 1000);
      userIntervals.filterData[socket.id] = filterDataInterval;
    });

    socket.on("getOneData", async (data) => {
      const filterDataInterval = setInterval(async () => {
        io.to(socket.id).emit(
          "getOneDataSend",
          await productSchema.findOne({ name: data.identifier })
        );
      }, 1000);
      userIntervals.oneData[socket.id] = filterDataInterval;
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      clearInterval(userIntervals.allData[socket.id]);
      delete userIntervals.allData[socket.id];

      clearInterval(userIntervals.filterData[socket.id]);
      delete userIntervals.filterData[socket.id];

      clearInterval(userIntervals.oneData[socket.id]);
      delete userIntervals.oneData[socket.id];
    });
  });
};

module.exports = socketTestCase;
