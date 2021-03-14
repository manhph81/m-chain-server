import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    productName:String,
    productGarden: String,
    productOwner: String,
    productType:String,
    productPackaging: String,
    productUsing: String,
    productComposition: [],
    productPreservation: String,
    productSelectedFile: String,
    productCreatedAt: {
        type: Date,
        default: new Date(),
    },
})

var PostProduct = mongoose.model('products', postSchema);

export default PostProduct;