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

// import driver from 'bigchaindb-driver'
// const conn = new driver.Connection('https://test.ipdb.io/api/v1/', {
//     header1: 'header1_value',
//     header2: 'header2_value'
// })
// const tx = driver.Transaction.makeCreateTransaction(
//     id,
//     version,
//     inputs,
//     outputs,
//     conditions,
//     operation,
//     asset,
//     metadata,
// )