const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    topic: String,
    type2: String,
    date: String,
    views: Number,
    likes: Number,
    comments: Number
})

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Post', postSchema)
