import mongoose, { Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  name: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);
// This is a middleware that will hash the password before saving it to the database
//that is jab save ho data toh us se pehle just ye chale
userSchema.pre("save", async function (next) {
  // this is a reference to the current user document like email, password etc
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// models gives us all the models inside the database
const User = models?.User || model<IUser>("User", userSchema);

export default User;
