require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const DEFAULT_PORT = Number(process.env.PORT) || 5001;

const listenOnPort = (port) => {
  const server = app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      listenOnPort(port + 1);
      return;
    }

    throw error;
  });
};

const startServer = async () => {
  await connectDB();
  listenOnPort(DEFAULT_PORT);
};

startServer();
