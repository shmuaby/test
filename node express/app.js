const express = require("express");
const app = express();
const port = 8000;
const { v4: uuids4 } = require("uuid");
const bcrypt = require("bcrypt");

const porsen = [
  {
    id: "1",
    email: "shmueliKing",
    password: bcrypt.hashSync("1234567", 10),
  },
  { id: "2", email: "KingMan", password: bcrypt.hashSync("76543321", 10) },

  { id: "3", email: "KingDavid", password: bcrypt.hashSync("10203040506", 10) },
];
app.use(express.json());

app.get("/", (req, res) => {
  res.send(porsen);
});

app.get("/:id", (req, res) => {
  porsen.forEach((element) => {
    if (element.id === req.params.id) {
      res.send(element);
    }
  });
});

app.post("/newUser", (req, res) => {
  try {
    const user = req.body;
    if (typeof user !== "object") throw new Error("not a good info");
    porsen.push(user);
    return res.send(porsen);
  } catch (error) {
    res.status(400).send(error.massage);
  }
});

app.put("/:id", (req, res) => {
  const user = req.body.id;
  porsen.forEach((element) => {
    if (element.id === req.params.id) {
      element.id = user;
      res.send(element);
    }
  });
});

app.delete("/:id", (req, res) => {
  const UserID = req.params.id;
  const userIndex = porsen.findIndex((user) => user.id === UserID);
  if (userIndex !== -1) {
    porsen.splice(userIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.post("/adUser", (req, res) => {
  const id = uuids4();
  const email = req.body.email;
  const password = req.body.password;
  const adUser = { id, email, password };
  porsen.push(adUser);
  res.send(porsen);
});

app.post("/findUser", (req, res) => {
  const { email, password } = req.params;
  const user = porsen.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    res.send({ message: "User is connected " });
  } else {
    res.send({ message: "wrong credentials" });
  }
});

app.post("/bcrypt", async (req, res) => {
  const { email, password } = req.body;
  const user = porsen.find((user) => user.email === email);
  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send({ message: "User exists." });
    } else {
      res.send({ message: "Password is incorrect." });
    }
  } else {
    res.send({ message: "User does not exist." });
  }
});

app.listen(port, () => {
  console.log(`server is op and running on http://localhost:${port}`);
});
