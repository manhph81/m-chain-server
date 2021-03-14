import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    name:String,
    detail: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var CareProcess = mongoose.model('SuppcareProcessliers', postSchema);

export default CareProcess;