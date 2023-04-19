import mongoose, { Schema } from "mongoose";
import passportLocalMongoose = require("passport-local-mongoose");

export interface UserType {
  email: String;
  username: String;
}

export const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    typre: String,
  },
  resetPasswordToken: String,
});

UserSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject?._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

