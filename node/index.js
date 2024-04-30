import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
const PORT = 4444;
const uri = "mongodb://localhost:27017/blog";

const app = express();
app.use(express.json());

import UserModel from "./models/User.js";

mongoose
    .connect(uri)
    .then(() => console.log("DataBase - OK"))
    .catch((err) => console.log("DataBase error: ", err));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/auth/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: "Incorrect email or password",
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(400).json({
                message: "Incorrect email or password",
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            },
        );

        const { passwordHash, ...userData } = user._doc

        res.json(
            {
                ...userData,
                token,
            }
        );

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to log in",
        })
    }
})

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            },
        );

        const { passwordHash, ...userData } = user._doc

        res.json(
            {
                ...userData,
                token,
            }
        );

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to register",
        })
    }
});

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server - OK, port: " + PORT);
})