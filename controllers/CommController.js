import CommentModel from "../models/Commentary.js";

export const getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await CommentModel.find({
            post: postId,
        }).populate("user", "fullName avatarUrl").sort({ 'updatedAt': -1 }).exec();
        res.json(comments);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Couldn't get the commentaries",
        })
    }
}

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = new CommentModel({
            user: req.userId,
            text: req.body.text,
            post: postId,
        });
        await doc.save();
        const comments = await CommentModel.find({
            post: postId,
        }).populate("user", "fullName avatarUrl").sort({ 'updatedAt': -1 }).exec();
        res.json(comments);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "The comment could not be created",
        })
    }
}

export const removeComment = async (req, res) => {
    try {
        const tagId = req.params.id;
        const tag = await CommentModel.findOneAndDelete(
            {
                _id: tagId,
            },
        );

        if (!tag) {
            return res.status(500).json({
                message: "Couldn't find the article",
            })
        }
        const comments = await CommentModel.find({
            post: tag.post,
        }).populate("user", "fullName avatarUrl").sort({ 'updatedAt': -1 }).exec();
        res.json(comments);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Couldn't remove the article",
        })
    }
}