import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import chatRoute from "./src/routes/chat.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/chat", chatRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
