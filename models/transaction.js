import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    id: {type : String, require:true},
    version: {type : String, require:true},
    inputs: {type : Object, require:true},
    outputs: {type : Object, require:true},
    conditions:[],
    operation:[],
    asset:[],
    metadata:[],
})

var Process = mongoose.model('transaction', postSchema);

export default Process;
