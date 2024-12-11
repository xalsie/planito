require("dotenv").config();
require("./models/db");
const path = require("node:path");
const cors = require("cors");
const express = require("express");

const eventRoutes = require("./routes/event.route");

const port = process.env.PORT;

const app = express();

app.listen(port || 3000, () => {
  console.log(`Planito app listening on port ${port}`);
});

app.use(express.urlencoded({ extended: true, limit: "16mb" })); // Adjust the limit as needed
app.use(express.json()); // application/json
const corsOptions = {
  origin: process.env.FRONT_URL,
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/events", eventRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, invalid_data: data });
});
