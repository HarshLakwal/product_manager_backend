import jwt from 'jsonwebtoken';
import { getAdmin } from '../model/registerAdmin.model.js';
import customErrorHandler from '../services/customErrorHandler.js';

const checkRole = async (req, res, next) => {
    console.log(req)
    const authHeader = req.headers.authorization;
    console.log('authHeader',authHeader)
    if (!authHeader) {
        return res.status(404).json({
            success: false,
            message: "Token is not found",
        });
    }

    try {
        let token = authHeader.split(" ")[1];

        const data = jwt.verify(token, process.env.JWT_SECRET);

        let admin = await getAdmin(data.email)
  
        if (!admin) return next(customErrorHandler.notFound("admin not found"))
        if (data.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: `unAuthorized user!`,
            });
        }
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            success: false,
            message: `Error occur ${err.message}`,
        });
    }
};

export default checkRole