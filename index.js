//configuration
require("dotenv").config(); 
const express = require("express");
//set up monoogoose
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const { checkAuth } = require('./middleware/auth');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;

//middleware usage
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(checkAuth('token'));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "View"));

// Import and use routers
const userRouter = require("./Routes/user");
const linkRouter = require("./Routes/link");
const themeRouter = require("./Routes/theme");
const userPageRouter = require("./Routes/view");
const uploadRouter = require("./Routes/upload");


app.use("/user", userRouter);
app.use("/link", linkRouter);
app.use("/theme", themeRouter);
app.use("/", userPageRouter);
app.use("/upload", uploadRouter);
mongoose.set("strictQuery", false);





const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("Error in connecting MongoDB:", error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
  });
});
