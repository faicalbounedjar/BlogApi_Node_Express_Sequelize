const express = require("express");
const { sequelize, User, Post } = require("./models");
const app = express();
const port = 3000;

// middleware
app.use(express.json());
// routes
// get all users
app.get("/users/", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(201).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});
// get user by id
app.get("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    // const users = await User.findAll();
    const users = await User.findOne({
      where: { uuid },
      include: "posts",
    });
    return res.status(201).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});
// get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({ include: User });
    return res.status(201).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!!" });
  }
});
// add new post
app.post("/posts", async (req, res) => {
  const { userUuid, content } = req.body;
  try {
    const user = await User.findOne({
      where: { uuid: userUuid },
    });
    const post = await Post.create({ userId: user.id, content });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong!!" });
  }
});
// add new user
app.post("/users", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await User.create({ name, email, role });
    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// update user
app.put("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const { name, email, role } = req.body;
  try {
    // const users = await User.findAll();
    const user = await User.findOne({
      where: { uuid },
    });
    user.name = name;
    user.email = email;
    user.role = role;
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
// delete user
app.delete("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    // const users = await User.findAll();
    const user = await User.findOne({
      where: { uuid },
    });
    await user.destroy();
    return res.status(201).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});
// launch
app.listen(port, async () => {
  console.log(`listening on port ${port}`);
  await sequelize.authenticate();
  console.log("connected");
});
