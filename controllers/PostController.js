import PostModel from '../models/Post.js'


export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error getting all posts"
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()

        const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error getting all posts"
        })
    }
}


export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        if (!postId || typeof postId !== 'string' || postId.length !== 24) {
            return res.status(400).json({
                message: "Invalid postId"
            });
        }
        const updatedDoc = await PostModel.findOneAndUpdate({
            _id: postId
        }, {
            $inc: {
                viewsCount: 1
            }
        }, {
            // returnDocument: 'after'
            new: true
        }).populate('user')
        if (!updatedDoc) {
            return res.status(404).json({
                message: "There is no article here"
            })
        }
        res.json(updatedDoc);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error to get an exact post"
        })
    }
}



export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            text: req.body.text,
            user: req.userId
        })

        const post = await doc.save()
        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Post creating error"
        })
    }
}
export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        const deletedDoc = await PostModel.findByIdAndDelete(postId);

        if (!deletedDoc) {
            return res.status(404).json({
                message: "There is no article here"
            })
        }
        res.json({
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error to delete an exact post"
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id
        const update = {
            title: req.body.title,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            text: req.body.text,
            user: req.userId
        }
        const updatedDoc = await PostModel.findOneAndUpdate({
                _id: postId
            },
            update, {
                new: true
            }
        );

        res.json({
            success: true,
            updatedDoc
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Post update error"
        })
    }
}