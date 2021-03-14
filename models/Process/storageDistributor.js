import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    name:String,
    detail: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var StorageDistributor = mongoose.model('storageDistributor', postSchema);

export default StorageDistributor;