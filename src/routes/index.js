import express from 'express';
import productsController from '../controller/admin/index.js';
import userAuthController from '../controller/user/index.js';

const route = express.Router();

route.get("/get-products", productsController.getProducts);
route.get("/get-product", productsController.getProduct);

route.post("/register-user",userAuthController.registerUser );
route.post("/login-user", userAuthController.loginUser)

export default route;