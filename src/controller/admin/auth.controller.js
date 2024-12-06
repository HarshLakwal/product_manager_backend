import joi from "joi";
import bcrypt from 'bcrypt';

import customErrorHandler from "../../services/customErrorHandler.js";
import JWTService from "../../services/JWTService.js";
import { adminModel, getAdmin, loginAdmin, registerAdmin } from "../../model/registerAdmin.model.js";

const authController = {

    async registerAdmin(req, res, next) {
        const inputSanitizer = joi.object({
            email: joi.string().required(),
            password: joi.string().required()
        });
        const { error } = inputSanitizer.validate(req.body);
        if (error) {
            return next(error);
        }
        try {
            const { email, password } = req.body;

            const adminData = await getAdmin(email);
            if (adminData) {
                return next(customErrorHandler.alreadyExist("Admin already register"));
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = { email, password: hashedPassword }

            const admin = await registerAdmin(data);
            if (!admin) return next(customErrorHandler.ServerError("something went wrong while register the admin"));

            res.status(200).json({ message: "Register Success" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    },

    async loginAdmin(req, res, next) {
        console.log(req.body)
        const inputSanitizer = joi.object({
            email: joi.string().required(),
            password: joi.string().required()
        });

        const { error } = inputSanitizer.validate(req.body);
        if (error) {
            return next(error);
        }
        try {
            const { email, password } = req.body;
           
            const adminData = await adminModel.findOne({email});
            if (!adminData) {
                return next(customErrorHandler.notFound("Email not found!"));
            }
            const match = await bcrypt.compare(password, adminData.password);
            console.log(match)
            if (!match) {
                return next(customErrorHandler.wrongCredentails("Wrong password. Please try again!"))
            }
            const token = JWTService.signToken({ email: adminData.email, role: adminData.role});
            res.status(200).json({ result: "Login Success", admin: adminData, token: token });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}

export default authController;