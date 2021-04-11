import express from 'express';
import mongoose from 'mongoose';

import PostProcess from '../models/process.js';

const router = express.Router();

export const getProcess = async (req, res) => { 
    try {
        const process = await PostProcess.find();
        res.status(200).json(process);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getPro = async (req, res) => { 
    const { id } = req.params;
    try {
        const process = await PostProcess.findById(id);
        res.status(200).json(process);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const createProcess = async (req, res) => {
    const pro = req.body;
    var process = await PostProcess.findById(pro.productId)
    if (process===null){
        try {
            var newPostProcess = new PostProcess({ _id: pro.productId,Manufacturer:[
                {...pro, processCreatedAt: new Date().toISOString()}
            ] })
            await newPostProcess.save();
            res.status(201).json(newPostProcess);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }else {
        if(pro.processType==="Manufacturer"){
            process?.Manufacturer.push(pro)
        }else  if(pro?.processType==="Distributor"){
            process?.Distributor.push(pro)
        }else {
            process?.Retailer.push(pro)
        }
       
        await PostProcess.findByIdAndUpdate(pro.productId, process, { new: true });
        res.json(process);
    }  
   
}

export const updateProcess = async (req, res) => {
    const { id } = req.params;
    const post = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(200).json({ message : `No post with id: ${id}`});

    const updatedPost = { ...post, _id: id };
    await PostProcess.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deleteProcess = async (req, res) => {
    const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(200).json({ message : `No post with id: ${id}`});
    
        await PostProcess.findByIdAndRemove(id);
    
        res.json({ result: "Post deleted successfully." });
}

export default router;