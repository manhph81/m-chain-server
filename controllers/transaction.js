import express from 'express';
import driver from 'bigchaindb-driver'
import User from '../models/user.js';
import Process from '../models/process.js';
import PostTransaction from '../models/transaction.js';
import PostProduct from '../models/postProduct.js';


const router = express.Router();

// const API_PATH = 'mongodb://127.0.0.1:27017'

const API_PATH = 'https://test.ipdb.io/api/v1/'

const conn = new driver.Connection(API_PATH, {
    header1: 'header1_value',
    header2: 'header2_value'
})

// const conn = new driver.Connection('https://test.ipdb.io/api/v1/')

export const getTransactions = async (req, res) => { 

    try {
        const assets = await PostTransaction.find({});
        // const assets = await conn.searchAssets('Coffee')
        // conn.searchMetadata('1.32')
        // .then(assets => console.log('Found assets with serial number Bicycle Inc.:', assets))
        res.status(200).json(assets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getTransaction = async (req, res) => { 
    const { id } = req.params;
    try {
        const transaction = await PostTransaction.find({asset : {data : id}});

        if(transaction?.length) {
            const metadata = transaction[transaction.length - 1]?.metadata
            const asset = transaction[transaction.length - 1]?.asset
             // const transaction = await PostTransaction.findById(id);
            // const metadata = await conn.searchMetadata(id)
            // const asset = await conn.searchAssets(id)
            if(metadata.length !== 0 && asset .length !== 0){
                const result = {product: asset, process: metadata}
                res.status(200).json(result);
            }else{
                res.status(202).json({ message: "Can't get product" })
            }
        }else {
            res.status(202).json({ message: "Can't find product" })
        }
        
       
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const createTransaction = async (req, res) => {
    const asset = req.body.product
    const newOwner = req.body.user    

    try {
        const tx = driver.Transaction.makeCreateTransaction(
            // asset.
            asset?._id,
            // metadata
            { name: 'My first BigchainDB transaction' },
            // A transaction needs an output
            [ driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(newOwner.acPublicKey))
            ],
            newOwner.acPublicKey
        )

        const txSigned = driver.Transaction.signTransaction(tx, newOwner.acPrivateKey)
         // ======== POST CREATE Transaction ======== //

        const newPostTransaction = new PostTransaction(txSigned)
        try {
            await newPostTransaction.save();
            //update product
            const updatedProduct = {...asset,  productOwnerId : newOwner._id, productOwner : newOwner.acName,  productPlace : newOwner.acType };
            await PostProduct.findByIdAndUpdate(asset?._id, updatedProduct, { new: true });

            res.status(202).json({ message:`Buy product successfully`})
        } catch (error) {
            res.status(400).json({ message: error.message });
        }

        // conn.postTransactionCommit(txSigned)
        // .then(retrievedTx => {
        //     console.log('Transaction', retrievedTx.id, 'successfully posted.')
        //     res.status(202).json({ message:`Buy product successfully`})
        // })
        // .catch(() => {
        //     res.status(202).json({ message:'Buy product fail.'})
        //     console.log('TransactionAlice fail posted.')
        // })
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
   
}

export const createTransactionB2B = async (req, res) => {
    const asset = req.body.product
    const newOwner = req.body.user
    var preOwner =  await User.findById(asset.productOwnerId);
    var process =  await Process.findById(asset?._id);
    var metadata = createMetadata(process,asset?.productGarden)
  
    try {
        const tx = driver.Transaction.makeCreateTransaction(
            // asset.
            asset?._id,
            metadata,

            // A transaction needs an output
            [ driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(preOwner.acPublicKey))
            ],
            preOwner.acPublicKey
        )

        const txSigned = driver.Transaction.signTransaction(tx, preOwner.acPrivateKey)
        const newPostTransaction = new PostTransaction(txSigned)

        // const txTransferBob = driver.Transaction.makeTransferTransaction(
        //     // signedTx to transfer and output index
        //     [{ tx: txSigned, output_index: 0 }],
        //     [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(preOwner.publicKey))],
        //     // metadata
        //     metadata
        // )

        // console.log(txTransferBob)

        // // Sign with alice's private key
        // let txTransferBobSigned = driver.Transaction.signTransaction(txTransferBob, newOwner.privateKey)

        
        // const newPostTransactionBob = new PostTransaction(txTransferBobSigned)

        try {
            await newPostTransaction.save();
            //update product
            const updatedProduct = {...asset,  productOwnerId : newOwner._id, productOwner : newOwner.acName,  productPlace : newOwner.acType };
            await PostProduct.findByIdAndUpdate(asset?._id, updatedProduct, { new: true });
            res.status(202).json({ message:`Buy product successfully`})
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
        
        // conn.postTransactionCommit(txSigned)
        // .then(retrievedTx => {
        //     console.log('Transaction', retrievedTx.id, 'successfully posted.')
        //     res.status(202).json({ message:`Buy product successfully`})
        // })
        // .then(() => {
        //     const txTransferBob = driver.Transaction.makeTransferTransaction(
        //             // signedTx to transfer and output index
        //             [{ tx: txCreateAliceSimpleSigned, output_index: 0 }],
        //             [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(preOwner.publicKey))],
        //             // metadata
        //             {metadata}
        //     )
    
        //     // Sign with alice's private key
        //     let txTransferBobSigned = driver.Transaction.signTransaction(txTransferBob, newOwner.privateKey)
        //     console.log('Transaction', retrievedTx.id, 'successfully posted.')
            
        //     //update product
        //     const updatedProduct = {...product,  productOwnerId : newOwner._id, productOwner : newOwner.acName,  productPlace : newOwner.acType };
        //     PostProduct.findByIdAndUpdate(asset?._id, updatedProduct, { new: true });

        //     // Post with commit so transaction is validated and included in a block
        //     return conn.postTransactionCommit(txTransferBobSigned)
        // })
        // .catch(() => {
        //     res.status(202).json({ message:'Buy product fail.'})
        //     console.log('TransactionAlice fail posted.')
        // })
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
  
}

const createMetadata = (process,productGarden)=>{
    var result = {
        Supplier:productGarden,
        Manufacturer:[],
        Distributor:[],
        Retailer:[]
    }
    
    if(process?.Manufacturer.length>0){
        process.Manufacturer.forEach(element => {
            result.Manufacturer.push({ processOwnerId:element.processOwnerId ,processName: element.processName, processDetail:element.processDetail, processCreateAt: element.processCreatedAt, processPlace: element.processPlace})
            
        });
    }
    if(process?.Distributor.length>0){
        process.Distributor.forEach(element => {
            result.Distributor.push({ processOwnerId:element.processOwnerId ,processName: element.processName, processDetail:element.processDetail, processCreateAt: element.processCreatedAt, processPlace: element.processPlace})
        })
    }
    if(process?.Retailer.length>0){
        process.Retailer.forEach(element => {
            result.Retailer.push({ processOwnerId:element.processOwnerId ,processName: element.processName, processDetail:element.processDetail, processCreateAt: element.processCreatedAt, processPlace: element.processPlace})
        })
    }
    return result
}

export default router;