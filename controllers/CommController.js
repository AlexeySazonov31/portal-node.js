import CommentModel from "../models/Commentary.js";
// import fs from "fs";

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
            text: req.body.text,
            user: req.userId,
            post: postId,
        });

        const comment = await doc.save();

        res.json(comment);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "The comment could not be created",
        })
    }
}

// export const remove = async (req, res) => {
//     try {
//         const postId = req.params.id;

//         const post = await PostModel.findOneAndDelete(
//             {
//                 _id: postId,
//             },
//         );

//         if (!post) {
//             return res.status(500).json({
//                 message: "Couldn't find the article",
//             })
//         } else if (post.imageUrl !== "") {
//             const filePath = import.meta.dirname + "/.." + post.imageUrl;
//             fs.unlinkSync(filePath);
//         }


//         res.json({
//             success: true,
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: "Couldn't remove the article",
//         })
//     }
// }


// export const update = async (req, res) => {
//     try {
//         const postId = req.params.id;
//         const post = await PostModel.findOneAndUpdate(
//             {
//                 _id: postId,
//             },
//             {
//                 title: req.body.title,
//                 text: req.body.text,
//                 tags: req.body.tags,
//                 imageUrl: req.body.imageUrl,
//                 user: req.userId,
//             },
//             {
//                 new: false,
//             },
//         );
//         // get old post and compare imageUrl 
//         // (if different - remove old image file)
//         if (post.imageUrl !== "" && post.imageUrl !== req.body.imageUrl) {
//             const filePath = import.meta.dirname + "/.." + post.imageUrl;
//             fs.unlinkSync(filePath);
//         }
//         res.json({
//             success: true,
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: "Couldn't find the article",
//         })
//     }
// }