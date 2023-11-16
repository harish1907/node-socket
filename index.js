const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const { database, port } = require("./config/keys");
const chalk = require("chalk");
const productSchema = require("./models/product.models");
const socketIO = require("socket.io");
const http = require("http");
const socketHandler = require("./socket/socketIoHandler");

const server = http.createServer(app);
const io = socketIO(server);

// Set up a connection event
socketHandler(io);
setInterval(async () => {
  io.emit("allData", await productSchema.find({}));
}, 1000);

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("combined"));

mongoose.set("useCreateIndex", true);
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log(`${chalk.green("✓")} ${chalk.blue("MongoDB Connected!")}`)
  )
  .then(async () => {
    // await productSchema.create({
    //     name: "Kaju",
    //     price: 40,
    //     quantity: 53,
    //     place: "Phase 2"
    // })
    const PORT = port || 5000;
    server.listen(
      PORT,
      console.log(
        `${chalk.green("✓")} ${chalk.blue(
          "Server Started on port"
        )} ${chalk.bgMagenta.white(PORT)}`
      )
    );
  })
  .catch((err) => console.log(err));
