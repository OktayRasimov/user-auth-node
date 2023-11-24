const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const users = [];
app.use(express.json());
app.get("/users", async (req, res) => {
  res.send(users);
});

app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const user = { name: req.body.name, password: hashedPass };
    users.push(user);
    res.status(201).send({ message: "Succsess user Created" });
  } catch (err) {
    console.error(`Something went wrong:${err}`);
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send({ message: "couldnt find user" });
  }
  try {
    // console.log(await bcrypt.compare(req.body.password, user.password));
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send({ message: "Succsessfull login" });
    }
  } catch (err) {
    console.log(`Something went wrong with logging:${err}`);
  }
});

app.listen(3000, () => {
  console.log(`app is listeting on port`);
});
