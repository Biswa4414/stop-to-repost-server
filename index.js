const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8000;

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongoDB connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

//SCHEMA
const postSchema = new mongoose.Schema({
  url: String,
});

const Post = mongoose.model("Post", postSchema);

//API
app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.post("/postData", async (req, res) => {
  try {
    const { url } = req.body;
    const existingPost = await Post.findOne({ url });
    if (existingPost) {
      return res.send({
        status: 400,
        message: "Post is already exist ",
      });
    }
    const postObj = new Post({ url });
    await postObj.save();
    return res.send({
      status: 200,
      message: "Post created successfully ",
      data: postObj,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Something wrong in database",
    });
  }
});

app.listen(PORT, () => {
  console.log(`listening to PORT :${PORT}`);
});
