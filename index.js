require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const { checkAuth } = require("./Middleware/auth");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware usage
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://backslashs.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "View"));

// Import and use routers
const userRouter = require("./Routes/user");
const linkRouter = require("./Routes/link");
const themeRouter = require("./Routes/theme");
const mediaRouter = require("./Routes/media");

// Apply checkAuth middleware globally except for /user/login
app.use((req, res, next) => {
  if (
    req.path === "/user/login" ||
    req.path === "/user/signup" ||
    req.path == "/user/get-by-username" ||
    req.path == "/link/get-by-username" ||
    req.path == "/theme/get-by-username" ||
    req.path=='/media/get-by-username'
  ) {
    next(); // Skip checkAuth for /user/login
  } else {
    checkAuth("auth_token")(req, res, next); // Apply checkAuth for all other routes
  }
});

// Routers
app.use("/user", userRouter);
app.use("/link", linkRouter);
app.use("/theme", themeRouter);
app.use("/media", mediaRouter);

mongoose.set("strictQuery", false);

// Connect to MongoDB
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
