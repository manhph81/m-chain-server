import express from 'express';
import mongoose from 'mongoose';

import PostGarden from '../models/postGarden.js';

const router = express.Router();

export const getPosts = async (req, res) => { 
    try {
        const postGarden = await PostGarden.find();
        res.status(200).json(postGarden);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostGarden.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostGarden = new PostGarden({ ...post, createPost: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostGarden.save();

        res.status(201).json(newPostGarden );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, owner, selectedFile, tags, likes } = req.body;
    
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { owner,likes, title, message, tags, selectedFile, _id: id };
    await PostGarden.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
        await PostGarden.findByIdAndRemove(id);
    
        res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if(!req.userId) return res.json({message: "Unauthenticated"})

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostGarden.findById(id);

    const index = post.likes.findIndex((id)=> id===String(req.userId))

    if(index===-1){
        //like the post
        post.likes.push(req.userId)
    }else{
        //distlike a post
        post.likes.pop((id)=>id === String(req.userId))
    }
    const updatedPost = await PostGarden.findByIdAndUpdate(id,post,{ new: true });
    
    res.json(updatedPost);
}


export default router;