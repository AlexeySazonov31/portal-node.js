import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import checkAuth from "./utils/checkAuth.js";

const PORT = 4444;
const uri = "mongodb://localhost:27017/blog";

mongoose
    .connect(uri)
    .then(() => console.log("DataBase - OK"))
    .catch((err) => console.log("DataBase error: ", err));

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);

app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.patch("/posts/:id", checkAuth, postCreateValidation, PostController.update);
app.delete("/posts/:id", checkAuth, PostController.remove);



app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server - OK, port: " + PORT);
})