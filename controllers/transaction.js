import express from 'express';
import driver from 'bigchaindb-driver'
import User from '../models/user.js';
import Process from '../models/process.js';

const router = express.Router();

const API_PATH = 'https://test.ipdb.io/api/v1/'
// const API_PATH = 'mongodb://127.0.0.1:27017'

// const conn = new driver.Connection(API_PATH, {
//     app_id: 'manhph',
//     app_key: '43K14'
// })
const conn = new driver.Connection('https://test.ipdb.io/api/v1/', {
    header1: 'header1_value',
    header2: 'header2_value'
})

export const getTransactions = async (req, res) => { 

    try {
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
        const metadata = await conn.searchMetadata(id)
        const asset = await conn.searchAssets(id)
        const result = {product: asset, process: metadata}
        console.log(result)
        res.status(200).json(result);
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
            asset,
            // A transaction needs an output
            [ driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(newOwner.acPublicKey))
            ],
            newOwner.acPublicKey
        )

        const txSigned = driver.Transaction.signTransaction(tx, newOwner.acPrivateKey)
         // ======== POST CREATE Transaction ======== //
        conn.postTransactionCommit(txSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
        res.status(200).json(txSigned);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
   
}

export const createTransactionB2B = async (req, res) => {
    const asset = req.body.product
    const newOwner = req.body.user
    var preOwner =  await User.findById(asset.productOwnerId);
    var metadata =  await Process.findById(asset._id);
    try {
        const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
            // asset.
            asset,
            metadata,
            // A transaction needs an output
            [ driver.Transaction.makeOutput(
                            driver.Transaction.makeEd25519Condition(preOwner.acPublicKey))
            ],
            preOwner.acPublicKey
        )
        
        // Sign the transaction with private keys of Alice to fulfill it
        const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, preOwner.acPrivateKey)

        // Send the transaction off to BigchainDB
        await conn.postTransactionCommit(txCreateAliceSimpleSigned)
            .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
            // With the postTransactionCommit if the response is correct, then the transaction
            // is valid and commited to a block
            // Transfer bicycle to Bob
            .then(() => {
                const txTransferBob = driver.Transaction.makeTransferTransaction(
                        // signedTx to transfer and output index
                            [{ tx: txCreateAliceSimpleSigned, output_index: 0 }],
                            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(newOwner.acPublicKey))],
                            // metadata
                            metadata
                )
        
                // Sign with alice's private key
                let txTransferBobSigned = driver.Transaction.signTransaction(txTransferBob, preOwner.acPrivateKey)
                console.log('Posting signed transaction: ', txTransferBobSigned)
        
                // Post with commit so transaction is validated and included in a block
                return conn.postTransactionCommit(txTransferBobSigned)
                    .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
        })
        res.status(200).json(txSigned);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
   
}

// function signTransaction() {
//     // get privateKey from somewhere
//     const privateKeyBuffer = Buffer.from(base58.decode(alice.privateKey))
//     return function sign(serializedTransaction, input, index) {
//         const transactionUniqueFulfillment = input.fulfills ? serializedTransaction
//                 .concat(input.fulfills.transaction_id)
//                 .concat(input.fulfills.output_index) : serializedTransaction
//         const transactionHash = crypto.createHash('sha3-256').update(transactionUniqueFulfillment).digest()
//         const ed25519Fulfillment = new Ed25519Sha256();
//         ed25519Fulfillment.sign(transactionHash, privateKeyBuffer);
//         return ed25519Fulfillment.serializeUri();
//     };
// }

export default router;