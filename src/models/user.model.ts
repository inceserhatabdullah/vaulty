import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{6,})/.test(value);
      },
      message:
        "Password must be at least 6 characters long and contain at least one letter, one number, and one special character.",
    },
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = model("User", userSchema);
