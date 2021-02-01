const postsRouter = require('express').Router()
const Post = require('../models/post')

postsRouter.get('/', async (request, response) => {
    const posts = await Post.find({})
    response.json(posts)
})

postsRouter.post('/', async (request, response) => {
    const body = request.body

    if (body.title === undefined) {
        response.status(400).end()
    } else {
        const post = new Post({
            title: body.title,
            topic: body.topic,
            type2: body.type2,
            date: body.date,
            views: body.views === undefined ? 0 : body.views,
            likes: body.likes === undefined ? 0 : body.likes,
            comments: body.comments === undefined ? 0 : body.comments
        })

        const savedPost = await post.save()
        response.status(201).json(savedPost)
    }
})

postsRouter.delete('/:id', async (request, response) => {
    const post = await Post.findById(request.params.id)
    if (post) {
        await Post.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }

})

postsRouter.put('/:id', async (request, response) => {
    const oldPost = await Post.findById(request.params.id)
    const body = request.body
    const post = {
        title: body.title === undefined ? oldPost.title : body.title,
        topic: body.topic === undefined ? oldPost.topic : body.topic,
        type2: body.type2 === undefined ? oldPost.type2 : body.type2,
        date: body.date === undefined ? oldPost.date : body.date,
        views: body.views === undefined ? oldPost.views : body.views,
        likes: body.likes === undefined ? oldPost.likes : body.likes,
        comments: body.comments === undefined ? oldPost.comments : body.comments
    }

    const updatedPost = await Post.findByIdAndUpdate(request.params.id, post, { new: true })
    response.status(200).json(updatedPost)
})

module.exports = postsRouter
