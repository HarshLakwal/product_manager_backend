import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, default: null },
    price: { type: Number, default: null },
    category: { type: String, default: null },
    inStock: { type: Boolean, default: null },
    image: { type: String, default: null }
}, { timestamps: true });

const products = mongoose.model('products', productSchema);


export const addProduct = (data) => new products(
    {
        name: data.name,
        price: data.price,
        category: data.category,
        inStock: data.inStock,
        image: data.image
    }
).save().then((data) => data.toObject());

export const getProducts = () => products.find({});

export const getSingleProduct = (id) => products.findById({ _id: id });

export const deleteSingleProduct = (id) => products.findByIdAndDelete({ _id: id });

export const updateSingleProduct = (data) => products.findByIdAndUpdate(
    { _id: data.id },
    {
        $set:
        {
            name: data.name,
            price: data.price,
            category: data.category,
            inStock: data.inStock,
            image: data.image
        }
    },{new: true}
)
