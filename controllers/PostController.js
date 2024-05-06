import PostModel from "../models/Post.js";
import fs from "fs";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(8).exec();
        const tags = posts.map(elem => elem.tags).flat().slice(0, 5);
        res.json(tags);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Couldn't get the articles",
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user", "fullName email avatarUrl createdAt").sort({ 'updatedAt': -1 }).exec();
        res.json(posts);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Couldn't get the articles",
        })
    }
}

export const getAllByTag = async (req, res) => {
    try {
        const postId = req.params.tag;
        const posts = await PostModel.find({
            tags: postId,
        }).populate("user", "fullName email avatarUrl createdAt").sort({ 'updatedAt': -1 }).exec();
        
        if(posts.length){
            res.json(posts);
        } else {
            res.status(404).json({
                message: "Couldn't get the articles",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Couldn't get the articles",
        })
    }
}

export const getPopular = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user", "fullName email avatarUrl createdAt").sort({ 'viewsCount': -1 }).exec();
        res.json(posts);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Couldn't get the articles",
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                new: true,
            },
        ).populate("user", "fullName email avatarUrl createdAt").exec();
        if (!post) {
            return res.status(500).json({
                message: "Couldn't find the article",
            })
        }
        res.json(post);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Couldn't find the article",
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findOneAndDelete(
            {
                _id: postId,
            },
        );

        if (!post) {
            return res.status(500).json({
                message: "Couldn't find the article",
            })
        } else if (post.imageUrl !== "") {
            const filePath = import.meta.dirname + "/.." + post.imageUrl;
            fs.unlinkSync(filePath);
        }


        res.json({
            success: true,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Couldn't remove the article",
        })
    }
}

export const create = async (req, res) => {
    try {

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "The article could not be created",
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            },
            {
                new: false,
            },
        );
        // get old post and compare imageUrl 
        // (if different - remove old image file)
        if (post.imageUrl !== "" && post.imageUrl !== req.body.imageUrl) {
            const filePath = import.meta.dirname + "/.." + post.imageUrl;
            fs.unlinkSync(filePath);
        }
        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Couldn't find the article",
        })
    }
}