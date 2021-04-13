import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    id: {type : String, require:true},
    version: {type : String, require:true},
    inputs: {type : String, require:true},
    outputs: {type : String, require:true},
    conditions:[],
    operation:[],
    asset:[],
    metadata:[],
})

var Process = mongoose.model('transaction', postSchema);

export default Process;
