const Post = require('../models/post')

const initialPosts = [
    {
        title: 'Title_test',
        topic: 'Topic_test',
        type2: 'Type2_test',
        date: '2015-02-11',
        views: 5,
        likes: 4,
        comments: 3
    },
    {
        title: 'Title2_test',
        topic: 'Topic2_test',
        type2: 'Type22_test',
        date: '2015-03-12',
        views: 15,
        likes: 14,
        comments: 13
    },
    {
        title: 'Title3_test',
        topic: 'Topic3_test',
        type2: 'Type23_test',
        date: '2015-04-13',
        views: 153,
        likes: 143,
        comments: 133
    }
]

const nonExistingValidId = async () => {
    const post = new Post(
        {
            title: 'Title2_not_exist',
            topic: 'Topic2_test',
            type2: 'Type22_test',
            date: '2015-03-25',
            views: 15,
            likes: 14,
            comments: 13
        })
    await post.save()
    await post.remove()

    return post._id.toString()
}

const postsInDb = async () => {
    const posts = await Post.find({})
    return posts.map(post => post.toJSON())
}

module.exports = {
    initialPosts, nonExistingValidId, postsInDb
}