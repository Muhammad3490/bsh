require("dotenv").config(); // Load dotenv to read .env file
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Apply CORS headers first
app.use(express.json()); // Parse incoming JSON requests
// app.use(express.static("public")); // Serve static files from the public directory
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}))
// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "View"));


// Import and use routers
const userRouter = require("./Routes/user");
const linkRouter = require("./Routes/link");
const themeRouter=require('./Routes/theme')
app.use("/user", userRouter);
app.use("/link", linkRouter);
app.use('/theme',themeRouter);
mongoose.set("strictQuery", false);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected successfully: ${connection.connection.host}`);
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
