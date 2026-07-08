import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { setupSocketHandlers } from "./services/downloadQueue.js";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  maxHttpBufferSize: 1e6,
});

setupSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`[Cliply] API running on http://localhost:${PORT}`);
  console.log(`[Cliply] WebSocket ready for real-time progress`);
});
