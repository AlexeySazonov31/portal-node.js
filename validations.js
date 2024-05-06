import { body } from "express-validator";

export const registerValidation = [
    body("email", "Invalid mail format").isEmail(),
    body("password", "Password will be more then 5 characters").isLength({ min: 5 }),
    body("fullName", "Ful Name can't be less then 3 characters").isLength({ min: 3 }),
    body("avatarUrl", "Incorrect url to avatar picture").isString(),
];

export const loginValidation = [
    body("email", "Invalid mail format").isEmail(),
    body("password", "Password will be more then 5 characters").isLength({ min: 5 }),
];

export const postCreateValidation = [
    body("title", "Input post title").isLength({ min: 3 }).isString(),
    body("text", "Input post text").isLength({ min: 10 }).isString(),
    body("tags", "Invalid tag format (specify an array)").isArray(),
    body("imageUrl", "Incorrect url to post picture").isString(),
];
export const commentCreateValidation = [
    body("text", "Input post text").isLength({ min: 1 }).isString(),
];