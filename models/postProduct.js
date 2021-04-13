import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    productName:String,
    productGarden: String,
    productOwner: String,
    productOwnerId: String,
    productType:String,
    productPlace: String,
    productPackaging: String,
    productUsing: String,
    productComposition: [],
    productPreservation: String,
    productCreatedAt: {
        type: Date,
        default: new Date(),
    },
    productSelectedFile: String,
})

var PostProduct = mongoose.model('products', postSchema);

export default PostProduct;