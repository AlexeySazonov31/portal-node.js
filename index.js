import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handleValidationsErrors } from "./utils/index.js";

const port = 4444;
const uriDB = "mongodb://localhost:27017/blog";

mongoose
    .connect(uriDB)
    .then(() => console.log("DataBase - OK"))
    .catch((err) => console.log("DataBase error: ", err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/auth/login", loginValidation, handleValidationsErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationsErrors, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);

app.post("/posts", checkAuth, postCreateValidation, handleValidationsErrors, PostController.create);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationsErrors, PostController.update);
app.delete("/posts/:id", checkAuth, PostController.remove);



app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server - OK, port: " + port);
})