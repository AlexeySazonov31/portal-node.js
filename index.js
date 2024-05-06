import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import 'dotenv/config'

import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from "./validations.js";
import { UserController, PostController, CommController } from "./controllers/index.js";
import { checkAuth, handleValidationsErrors } from "./utils/index.js";

mongoose
    .connect(process.env.DB_CONN)
    .then(() => console.log("DataBase - OK"))
    .catch((err) => console.log("DataBase error: ", err));

const app = express();

const postsStorage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads/posts");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
})
const avatarsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
})

const uploadPost = multer({ storage: postsStorage });
const uploadAvatar = multer({ storage: avatarsStorage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/auth/login", loginValidation, handleValidationsErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationsErrors, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload/post", checkAuth, uploadPost.single("image"), (req, res) => {
    res.json({
        url: req.file.originalname,
    })
});
app.post("/upload/avatar", uploadAvatar.single("image"), (req, res) => {
    res.json({
        url: req.file.originalname,
    })
});

app.get("/posts", PostController.getAll);
app.get("/posts/popular", PostController.getPopular);
app.get("/posts-by-tag/:tag", PostController.getAllByTag);
app.get("/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);

app.post("/posts", checkAuth, postCreateValidation, handleValidationsErrors, PostController.create);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationsErrors, PostController.update);
app.delete("/posts/:id", checkAuth, PostController.remove);

app.get("/comments/:id", CommController.getCommentsByPost);
app.post("/comments/:id", checkAuth, commentCreateValidation, handleValidationsErrors, CommController.createComment);
app.delete("/comments/:id", checkAuth, CommController.removeComment);




app.listen(process.env.PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server - OK, port: " + process.env.PORT);
})