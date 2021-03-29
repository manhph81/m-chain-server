import express from 'express';
import driver from 'bigchaindb-driver'
import base58 from 'bs58'
import crypto from 'crypto'
import { Ed25519Sha256 } from 'crypto-conditions';

const router = express.Router();

const API_PATH = 'https://test.ipdb.io/api/v1/'
const conn = new driver.Connection('https://test.ipdb.io/api/v1/', {
    header1: 'header1_value',
    header2: 'header2_value'
})

const alice = new driver.Ed25519Keypair()
const bob = new driver.Ed25519Keypair()



export const getTransaction = async (req, res) => { 
    try {
        const assets = await conn.searchAssets('Berlin, DE.')
        res.status(200).json(assets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const createTransaction = async (req, res) => {
    const data = req.body
    try {
        const tx = driver.Transaction.makeCreateTransaction(
            // Define the asset to store, in this example it is the current temperature
            // (in Celsius) for the city of Berlin.
            { city: 'Berlin, DE', temperature: 22, datetime: new Date().toString() },
        
            // Metadata contains information about the transaction itself
            // (can be `null` if not needed)
            data,
        
            // A transaction needs an output
            [ driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(alice.publicKey))
            ],
            alice.publicKey
        )
        
        const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
        
        conn.postTransactionCommit(txSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
        res.status(200).json(txSigned);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
   
}

function signTransaction() {
    // get privateKey from somewhere
    const privateKeyBuffer = Buffer.from(base58.decode(alice.privateKey))
    return function sign(serializedTransaction, input, index) {
        const transactionUniqueFulfillment = input.fulfills ? serializedTransaction
                .concat(input.fulfills.transaction_id)
                .concat(input.fulfills.output_index) : serializedTransaction
        const transactionHash = crypto.createHash('sha3-256').update(transactionUniqueFulfillment).digest()
        const ed25519Fulfillment = new Ed25519Sha256();
        ed25519Fulfillment.sign(transactionHash, privateKeyBuffer);
        return ed25519Fulfillment.serializeUri();
    };
}

export default router;