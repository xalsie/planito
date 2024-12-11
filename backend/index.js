require("dotenv").config();
require("./models/db");
const cors = require("cors");
const express = require("express");

const userRoutes = require("./routes/user");
const moduleRoutes = require("./routes/module");
const roomRoutes = require("./routes/room");
const materialRoutes = require("./routes/material");
const eventRoutes = require("./routes/event");
const schoolRoutes = require("./routes/school");
const authRoutes = require("./routes/auth");

const port = process.env.PORT;

const app = express();

app.listen(port || 3000, () => {
  console.log(`Planito app listening on port ${port}`);
});

app.use(express.urlencoded({ extended: true, limit: "16mb" })); // Adjust the limit as needed
app.use(express.json());
const corsOptions = {
  origin: process.env.FRONT_URL,
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/users", userRoutes);
app.use("/modules", moduleRoutes);
app.use("/rooms", roomRoutes);
app.use("/materials", materialRoutes);
app.use("/events", eventRoutes);
app.use("/schools", schoolRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.error("Error occurred:", error); // Affiche l'erreur dans les logs
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, invalid_data: data });
});
