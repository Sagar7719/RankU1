import mongoose from "mongoose";

const dbHealthcheck = async () => {
  const readyState = mongoose.connection.readyState;
  return {
    readyState,
    readyStateLabel:
      readyState === 1
        ? "connected"
        : readyState === 2
          ? "connecting"
          : readyState === 3
            ? "disconnecting"
            : "disconnected",
    host: mongoose.connection?.host,
    port: mongoose.connection?.port,
  };
};

export default dbHealthcheck;

