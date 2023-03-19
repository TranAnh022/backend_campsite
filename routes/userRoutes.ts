import express from "express";
import passport from "passport";
import { createUser, login, logout } from "../controllers/user";

const router = express.Router();

//--register--
router.get("/register", async () => {
  console.log("work");
});

router.post("/register", createUser);

//-- Login ---

router.post("/login", passport.authenticate("local"), login);

router.get("/logout", logout);

module.exports = router;
