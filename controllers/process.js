import express from 'express';
import mongoose from 'mongoose';

import PostGarden from '../models/process.js';

const router = express.Router();

export const getProcess = async (req, res) => { 
    try {
        const postGarden = await PostGarden.find();
        res.status(200).json(postGarden);
    } catch (error) {
        res.status(200).json({ message: error.message });
    }
}


export const createProcess = async (req, res) => {
    const post = req.body;

    const newPostGarden = new PostGarden({ ...post, createPost: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostGarden.save();

        res.status(201).json(newPostGarden );
    } catch (error) {
        res.status(200).json({ message: error.message });
    }
}

export const updateProcess = async (req, res) => {
    const { id } = req.params;
    const post = req.body;
    
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(200).json({ message : `No post with id: ${id}`});

    const updatedPost = { ...post, _id: id };
    await PostGarden.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deleteProcess = async (req, res) => {
    const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(200).json({ message : `No post with id: ${id}`});
    
        await PostGarden.findByIdAndRemove(id);
    
        res.json({ result: "Post deleted successfully." });
}


export default router;