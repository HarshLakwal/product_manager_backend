import mongoose from "mongoose";

const registerUserSchema = new mongoose.Schema(
    {
        email: { type: String, default: null },
        password: { type: String, default: null },
        role: { type: String, default: "user" },
    },
    { timestamps: true }
);

export const userModel = mongoose.model("user", registerUserSchema);

export const registerUser = (data) => new userModel({ email: data.email, password: data.password }).save().then((data) => data.toObject());
export const getUser = (email) => userModel.findOne({ email: email });
export const loginUser = (data) => userModel.findOne({ email: data.email, password: data.password })


