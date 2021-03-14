import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    name:String,
    owner: String,
    from: String,
    to: String,
    phoneReceiver: String,
    phoneSender: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var Shipping = mongoose.model('Shipping', postSchema);

export default Shipping;