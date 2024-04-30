import { body } from "express-validator";

export const registerValidation = [
    body("email", "Invalid mail format").isEmail(),
    body("password", "Password will be more then 5 characters").isLength({ min: 5 }),
    body("fullName", "Ful Name can't be less then 3 characters").isLength({ min: 3 }),
    body("avatarUrl", "Incorrect url to avatar picture").optional().isURL(),
];