import express from 'express';
import driver from 'bigchaindb-driver'
import Process from '../models/process.js';
import PostProduct from '../models/postProduct.js';


const router = express.Router();

// const API_PATH = 'mongodb://127.0.0.1:27017'
// const conn = new driver.Connection('https://test.ipdb.io/api/v1/')

const API_PATH = 'https://test.ipdb.io/api/v1/'

const conn = new driver.Connection(API_PATH, {
    header1: 'header1_value',
    header2: 'header2_value'
})


export const getTransactions = async (req, res) => { 

    try {
        // const assets = await PostTransaction.find({});
        // const assets = await conn.searchAssets('43k14')
        const assets = await conn.searchAssets('Coffee')
        
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
        const asset = await conn.searchAssets(id)
        const metadata = await conn.searchMetadata(id)
        if(metadata.length !== 0 && asset .length !== 0){
            const result = {product: asset[asset.length-1].data.phm.id, process: metadata[metadata.length-1]}
            console.log(result)
            res.status(200).json(result);
        }else{
            res.status(202).json({ message: "Can't get product" })
        }      
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const createTransaction = async (req, res) => {
    const asset = req.body.product
    const metadata = {'xoa81': '43k14'}
    const newOwner = req.body.user    

    const alice = new driver.Ed25519Keypair()
    const assetdata = {
        'phm': {
                'serial_number': '81',
                'manufacturer': 'Coffee',
                'xoa81': '43k14',
                'id' : asset?._id
        }
    }

    try {
        const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
            assetdata,
            metadata,
        
            // A transaction needs an output
            [ driver.Transaction.makeOutput(
                            driver.Transaction.makeEd25519Condition(alice.publicKey))
            ],
            alice.publicKey
        )
        
        // Sign the transaction with private keys of Alice to fulfill it
        const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)
        
        
        // Send the transaction off to BigchainDB
        
        
        conn.postTransactionCommit(txCreateAliceSimpleSigned)
            .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
            // With the postTransactionCommit if the response is correct, then the transaction
            // is valid and commited to a block
            .then(async() => {
               
                const updatedProduct = {...asset,  productOwnerId : newOwner._id, productOwner : newOwner.acName,  productPlace : newOwner.acType };
                await PostProduct.findByIdAndUpdate(asset?._id, updatedProduct, { new: true });
                res.status(202).json({ message:`Buy product successfully`})
        })
  
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
   
}

export const createTransactionB2B = async (req, res) => {
    const asset = req.body.product
    const newOwner = req.body.user   
    var process =  await Process.findById(asset?._id);
    var metadata = createMetadata(process,asset?.productGarden,asset?._id)

    const alice = new driver.Ed25519Keypair()
    const bob = new driver.Ed25519Keypair()

    const assetdata = {
        'phm': {
                'serial_number': '81',
                'manufacturer': 'Coffee',
                'xoa81': '43k14',
                'id' : asset?._id
        }
    }
    
    
    //Construct a transaction payload
    const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
        assetdata,
        metadata,
    
        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(alice.publicKey))
        ],
        alice.publicKey
    )
    
    // Sign the transaction with private keys of Alice to fulfill it
    const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)
    
    
    // Send the transaction off to BigchainDB
    
    
    conn.postTransactionCommit(txCreateAliceSimpleSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
        // With the postTransactionCommit if the response is correct, then the transaction
        // is valid and commited to a block
    
        // Transfer bicycle to Bob
        .then(() => {
            const txTransferBob = driver.Transaction.makeTransferTransaction(
                    // signedTx to transfer and output index
                    [{ tx: txCreateAliceSimpleSigned, output_index: 0 }],
                    [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(bob.publicKey))],
                    // metadata
                    {price: '100 euro'}
            )
    
            // Sign with alice's private key
            let txTransferBobSigned = driver.Transaction.signTransaction(txTransferBob, alice.privateKey)
            console.log('Posting signed transaction: ', txTransferBobSigned)
    
            // Post with commit so transaction is validated and included in a block
            return conn.postTransactionCommit(txTransferBobSigned)
    })
    .then(async() => {
        //update product
        const updatedProduct = {...asset,  productOwnerId : newOwner._id, productOwner : newOwner.acName,  productPlace : newOwner.acType };
        await PostProduct.findByIdAndUpdate(asset?._id, updatedProduct, { new: true });
    })
    // sent res
    .then(() =>  res.status(202).json({ message:`Buy product successfully`}))

}

const createMetadata = (process,productGarden,id)=>{
    var result = {
        _id: id,
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