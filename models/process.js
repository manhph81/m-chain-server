import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    // productId: String,
    Manufacturer:[
        {   
            processName:String,
            processDetail: String,
            processType: String,
            processOwner: String,
            processSelectedFile:String,
            processCreatedAt: {
                type: Date,
                default: new Date(),
            },
        }
    ],
    Distributor:[
        {   
            processName:String,
            processDetail: String,
            processType: String,
            processOwner: String,
            processSelectedFile:String,
            processCreatedAt: {
                type: Date,
                default: new Date(),
            },
        }
    ],
    Retailer:[
        {   
            processName:String,
            processDetail: String,
            processType: String,
            processOwner: String,
            processOwnerId: String,
            processSelectedFile:String,
            processCreatedAt: {
                type: Date,
                default: new Date(),
            },
        }
    ]
    
})

var Process = mongoose.model('process', postSchema);

export default Process;