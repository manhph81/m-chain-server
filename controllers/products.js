import express from 'express';
import mongoose from 'mongoose';
import QRCode from 'qrcode';

import PostProduct from '../models/postProduct.js';

const router = express.Router();

const generateQrCode = async (id) => {
    try {
          const url = await QRCode.toDataURL(id);
          await PostProduct.findByIdAndUpdate(id, {productURL : url}, { new: true });
    }catch (error) {
      console.log(error);
    }
  }

export const getProducts = async (req, res) => { 
    try {
        const postProduct = await PostProduct.find();
        res.status(200).json(postProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getProduct = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostProduct.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const createProduct = async (req, res) => {
    const product = req.body;
    const newPostProduct = new PostProduct({ ...product , productOwner: req?.userId, productCreatedAt: new Date().toISOString() })
    try {
        await newPostProduct.save();
        await generateQrCode(newPostProduct._id.toString())
        res.status(201).json(newPostProduct );
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message : `No post with id: ${id}`});

    const updatedPost = {...product, _id: id };
    await PostProduct.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(200).json({ message : `No post with id: ${id}`});
    
        await PostProduct.findByIdAndRemove(id);
    
        res.json({ result: "Post deleted successfully." });
}

export const likeProduct = async (req, res) => {
    const { id } = req.params;

    if(!req.userId) return res.json({message: "Unauthenticated"})

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(200).json({ message : `No post with id: ${id}`});
    
    const post = await PostProduct.findById(id);

    const index = post.likes.findIndex((id)=> id===String(req.userId))

    if(index===-1){
        //like the post
        post.likes.push(req.userId)
    }else{
        //distlike a post
        post.likes.pop((id)=>id === String(req.userId))
    }
    const updatedPost = await PostProduct.findByIdAndUpdate(id,post,{ new: true });
    
    res.json(updatedPost);
}


export default router;