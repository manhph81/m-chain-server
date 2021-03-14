import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    acName: {type : String, require:true},
    email: {type : String, require:true},
    password: {type : String, require:true},
    acType: {type : String, require:true},
    acAdress: String,
    acPhone: String,
    acEmail:String,
    acSelectedFile:String,
})

var User = mongoose.model('User', postSchema);

export default User;