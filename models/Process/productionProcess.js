import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    name:String,
    detail: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var ProductionProcess = mongoose.model('productionProcess', postSchema);

export default ProductionProcess;