const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");

//initialize the express app
const app = express();
//middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch((err) => console.log("db not connected", err));

//middleware
app.use(express.json());

app.use("/", require("./routes/AuthRoute")); //all routes goto the entery point=index.js(/)

const port = 8000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
