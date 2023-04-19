import express from "express";
import passport from "passport";
import { createUser, login, logout, sendCode, resetPassword } from "../controllers/userController";

const router = express.Router();

//--register--

router.post("/register", createUser);

//-- Login ---

router.post("/login", passport.authenticate("local"), login);

router.post("/password", sendCode)

router.post("/password/reset",resetPassword)

router.get("/logout", logout);

module.exports = router;
