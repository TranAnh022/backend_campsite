import { Request, Response, NextFunction } from "express";
const User = require("../models/user");
// import { Session } from "express-session";

//--Create User--

// interface SessionWithReturnTo extends Session {
//   returnTo?: string;
// }

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password); //using the register method from password middleware
    req.login(registerUser, (err) => {
      if (err) return next(err);
      res.status(200).json({ registerUser });
    });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

// --login--
export const login = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) res.status(400).json(user);
    res.status(200).json({ user });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};



//--logout--
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/camgsites");
  });
};
