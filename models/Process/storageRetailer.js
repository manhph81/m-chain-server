import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    name:String,
    detail: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var StorageRetailer = mongoose.model('storageRetailer', postSchema);

export default StorageRetailer;