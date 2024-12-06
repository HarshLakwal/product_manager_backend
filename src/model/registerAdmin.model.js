import mongoose from "mongoose";

const registerAdminSchema = new mongoose.Schema(
    {
        email: { type: String, default: null },
        password: { type: String, default: null },
        role: { type: String, default: "admin" },
    },
    { timestamps: true }
);

export const adminModel = mongoose.model("admin", registerAdminSchema);

export const registerAdmin = (data) => new adminModel({ email: data.email, password: data.password }).save().then((data) => data.toObject());
export const getAdmin = (email) => adminModel.findOne({ email: email });
export const loginAdmin = (data) => adminModel.findOne({ email: data.email, password: data.password })


