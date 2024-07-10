require("dotenv").config(); // Load dotenv to read .env file
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
mongoose.set("strictQuery", false);
const userRouter = require("./Routes/user");
const linkRouter = require("./Routes/link");
app.use("/user", userRouter);
app.use("/link", linkRouter);
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.static("public"));

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected successfully ${connection.connection.host}`);
  } catch (error) {
    console.error("Error in connecting MongoDB ", error);
    process.exit(1);
  }
};
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("App started on port ", PORT);
  });
});
