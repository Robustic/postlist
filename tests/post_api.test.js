const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Post = require('../models/post')

beforeEach(async () => {
    await Post.deleteMany({})
    await Post.insertMany(helper.initialPosts)
})

describe('GET operation for posts', () => {
    test('posts are returned as json', async () => {
        await api
            .get('/api/posts')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all posts are returned', async () => {
        const response = await api.get('/api/posts')
        expect(response.body).toHaveLength(helper.initialPosts.length)
    })

    test('a specific post is within the returned posts', async () => {
        const response = await api.get('/api/posts')
        const contents = response.body.map(r => r.title)
        expect(contents).toContain(helper.initialPosts[1].title)
    })

    test('a post includes field called id', async () => {
        const response = await api.get('/api/posts')
        const contents = response.body.map(r => r)
        expect(contents[0].id).toBeDefined()
    })
})

describe('POST operation for posts', () => {
    test('post can be added to the db', async () => {
        const newPost = {
            title: 'New_post_Title_test',
            topic: 'New_post_Topic2_test',
            type2: 'New_post_Type22_test',
            dateCreated: '2021-01-30',
            views: 999,
            likes: 998,
            comments: 997
        }

        await api
            .post('/api/posts')
            .send(newPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const postsInDB = await helper.postsInDb()
        expect(postsInDB).toHaveLength(helper.initialPosts.length + 1)

        const contents = postsInDB.map(post => post.title)
        expect(contents).toContain('New_post_Title_test')
    })

    test('likes 0 saved to db if not defined', async () => {
        const newPost = {
            title: '0_likes_Title_test',
            topic: '0_likes_Topic2_test',
            type2: '0_likes_Type22_test',
            dateCreated: '2020-02-02'
        }

        await api
            .post('/api/posts')
            .send(newPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const postsInDB = await helper.postsInDb()

        const content = postsInDB.filter(post => post.title === '0_likes_Title_test')
        expect(content[0].likes).toBeDefined()

        const contentWithLikes = postsInDB.filter(post => post.title === 'Title3_test')
        expect(contentWithLikes[0].likes).toBe(143)
    })

    test('post not saved if title is missing', async () => {
        const newPost = {
            topic: 'No_title_Topic2_test',
            type2: 'No_title_Type22_test',
            dateCreated: '2019-03-04',
            views: 999,
            likes: 998,
            comments: 997
        }

        await api
            .post('/api/posts')
            .send(newPost)
            .expect(400)

        const postsInDB = await helper.postsInDb()
        expect(postsInDB).toHaveLength(helper.initialPosts.length)
    })
})

describe('DELETE operation for posts', () => {
    test('fails if post id does not exist', async () => {
        const nonExistingValidId = await helper.nonExistingValidId()

        await api
            .delete(`/api/posts/${nonExistingValidId}`)
            .expect(404)
    })

    test('fails if post id invalid', async () => {
        const invalidNonExistingId = 'k435325k32455'

        await api
            .delete(`/api/posts/${invalidNonExistingId}`)
            .expect(400)
    })

    test('post can be deleted if exist', async () => {
        const postsBeforeDelete = await helper.postsInDb()
        const postToDelete = postsBeforeDelete[1]

        await api
            .delete(`/api/posts/${postToDelete.id}`)
            .expect(204)

        const postsAfterDelete = await helper.postsInDb()
        expect(postsAfterDelete.length).toBe(postsBeforeDelete.length - 1)

        const contents = postsAfterDelete.map(post => post.title)
        expect(contents).not.toContain(postToDelete.title)
    })
})

describe('PUT operation for posts', () => {
    test('post can be update to db', async () => {
        const postsBeforeUpdate = await helper.postsInDb()
        const postToUpdate = postsBeforeUpdate[1]
        const parametersToUpdate = {
            topic: 'New Topic_test'
        }

        await api
            .put(`/api/posts/${postToUpdate.id}`)
            .send(parametersToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const postsInDB = await helper.postsInDb()
        expect(postsInDB).toHaveLength(helper.initialPosts.length)

        const contents = postsInDB.map(post => post.topic)
        expect(contents).toContain('New Topic_test')

        const updatedPost = await Post.findById(postToUpdate.id)
        expect(updatedPost.title).toBe(postToUpdate.title)
        expect(updatedPost.topic).toBe('New Topic_test')
        expect(updatedPost.type2).toBe(postToUpdate.type2)
        expect(updatedPost.date).toBe(postToUpdate.date)
        expect(updatedPost.views).toBe(postToUpdate.views)
        expect(updatedPost.likes).toBe(postToUpdate.likes)
        expect(updatedPost.comments).toBe(postToUpdate.comments)
    })
})

afterAll(() => {
    mongoose.connection.close()
})