import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    gardenName: String,
    gardenYear: String,
    gardenOwner: String,
    gardenAddress: String,
    gardenType:String,
    gardenTags: [String],
    gardenSelectedFile: String,
    gardenCreatedBy:String ,
    gardenCreatedByName: String,
    gardenLikes: {
        type: [String],
        default: 0,
    },
    gardenCreatedAt: {
        type: Date,
        default: new Date(),
    },
})

var PostGarden = mongoose.model('PostGarden', postSchema);

export default PostGarden;