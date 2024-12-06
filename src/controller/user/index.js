import joi from "joi";
import bcrypt from 'bcrypt';

import customErrorHandler from "../../services/customErrorHandler.js";
import JWTService from "../../services/JWTService.js";
import { userModel, getUser, loginUser, registerUser } from "../../model/user.model.js";

const authController = {

    async registerUser(req, res, next) {
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

            const userData = await getUser(email);
            if (userData) {
                return next(customErrorHandler.alreadyExist("User already register"));
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = { email, password: hashedPassword }

            const user = await registerUser(data);
            if (!user) return next(customErrorHandler.ServerError("something went wrong while register the user"));

            res.status(200).json({ message: "Register Success" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    },

    async loginUser(req, res, next) {
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
           
            const userData = await userModel.findOne({email});
            if (!userData) {
                return next(customErrorHandler.notFound("Email not found!"));
            }
            const match = await bcrypt.compare(password, userData.password);
            console.log(match)
            if (!match) {
                return next(customErrorHandler.wrongCredentails("Wrong password. Please try again!"))
            }
            const token = JWTService.signToken({ email: userData.email, role: userData.role});
            res.status(200).json({ result: "Login Success", user: userData, token: token });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}

export default authController;