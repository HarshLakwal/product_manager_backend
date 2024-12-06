import { addProduct, deleteSingleProduct, getProducts, getSingleProduct, updateSingleProduct } from "../../model/Products.model.js";
import Joi from 'joi';
import customErrorHandler from "../../services/customErrorHandler.js";

const productsController = {
    async createProduct(req, res, next) {
        const inputSenitizer = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            category: Joi.string().required(),
            inStock: Joi.boolean().required(),
        })

        const { error } = inputSenitizer.validate(req.body);
        if (error) return next(error);

        const { name, price, category, inStock } = req.body;
        const data = {
            name, price, category, inStock
        }

        try {
            const product = await addProduct(data)
            if (!product) return next(customErrorHandler.ServerError("Something went wrong while create product"))
            res.status(200).json({ message: "product created successfully", success: true })
        } catch (error) {
            return res.status(500).json({ success: false, error })
        }

    },

    async getProducts(req, res, next) {
        const products = await getProducts();
        if (products.length === 0) {
            return res.status(404).json({ message: "Data not found", success: false })
        }
        res.status(200).json({ data: products, success: true })
    },

    async getProduct(req, res, next) {
        const inputSenitizer = Joi.object({
            id: Joi.string().required()
        });

        const { error } = inputSenitizer.validate(req.query)
        if (error) return next(error);
        const { id } = req.query;

        try {
            const product = await getSingleProduct(id);
console.log(product)
            if (!product) return next(customErrorHandler.notFound("Product not found"))

            res.status(200).json({ data: product, success: true });
        } catch (error) {
            return res.status(500).json({ success: false, error })
        }

    },

    async deleteProduct(req, res, next) {
        const inputSenitizer = Joi.object({
            id: Joi.string().required()
        });

        const { error } = inputSenitizer.validate(req.query);
        if (error) return next(error);
        const { id } = req.query;

        try {

            const product = await getSingleProduct(id); // check is product available in database
            console.log(product)
            if (!product) return next(customErrorHandler.notFound("Product that you are trying to delete is not found"));

            const isDeleted = await deleteSingleProduct(id); //delete the product
            if (!isDeleted) return next(customErrorHandler.ServerError("Something went wrong while deleting the product"));

            res.status(200).json({ message: "Product successfully deleted", success: true });
        } catch (error) {
            return res.status(500).json({ success: false, error })
        }

    },

    async updateProduct(req, res, next) {
        console.log(req.params)
        const inputSenitizer = Joi.object({
            id: Joi.string().required(),
            name: Joi.string().allow(null),
            price: Joi.number().allow(null),
            category: Joi.string().allow(null),
            inStock: Joi.boolean().allow(null),
        });

        const { error } = inputSenitizer.validate(req.query);
        if (error) return next(error);
        const { id, name, price, category, inStock } = req.query;
        const data = { id, name, price, category, inStock }
        try {
            const product = await getSingleProduct(id); // check is product available in database
            if (!product) return next(customErrorHandler.notFound("Product that you are trying to update is not found"));

            const isUpdated = await updateSingleProduct(data); //delete the product
            if (!isUpdated) return next(customErrorHandler.ServerError("Something went wrong while updating the product"));

            res.status(200).json({ message: "Product successfully updated", success: true });
        } catch (error) {
            return res.status(500).json({ success: false, error })
        }
    }

}

export default productsController;