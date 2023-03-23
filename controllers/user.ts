import { Request, Response, NextFunction } from "express";
const User = require("../models/user");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const crypto = require("crypto");

//--Create User--

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password); //using the register method from passport middleware
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

export const sendCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(404).json({ message: `There is no user with email :${email}` });
  } else {
    const code = crypto.randomBytes(6).toString("hex");
    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
      },
    };
    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Campingsite Team",
        link: "https://mailgen.js/",
      },
    });

    let response = {
      body: {
        name: `${user?.username}`,
        intro: `Here is the code help you to verifile your account ${email} in Campingsite :`,
        table: {
          data: { description: [`${code}`] },
        },
        outro: "Thank you",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: process.env.EMAIL,
      to: email,
      subject: "VERIFICATION CODE",
      html: mail,
    };

    transporter
      .sendMail(message)
      .then(() => {
        return res.status(201).json({
          msg: "you should receive an email",
          code,
        });
      })
      .catch((error: any) => {
        return res.status(500).json({ message: error.message });
      });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    await user
      .setPassword(password)
      .then(() => {
        user.save();
        res.status(200).json({ message: "successfully change password" });
      })
      .catch((error: any) => {
        res.status(400).json({ message: error.message });
      });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
