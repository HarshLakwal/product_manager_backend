import express from 'express';
import productsController from '../../controller/admin/index.js';
import authController from '../../controller/admin/auth.controller.js';
import checkRole from '../../middleware/checkRole.js';

const route = express.Router();

route.post("/register-admin", authController.registerAdmin);
route.post("/login-admin", authController.loginAdmin)

route.post("/create-product",checkRole, productsController.createProduct);
route.delete("/delete-product", checkRole,productsController.deleteProduct);
route.put("/update-product",checkRole, productsController.updateProduct);

export default route;