const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const userObjects = helper.initialUsers
        .map(user => new User(user))
    const promiseUserArray = userObjects.map(user => user.save())
    await Promise.all(promiseUserArray)

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseBlogArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseBlogArray)
})

describe('get blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('property id exists', async () => {
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].id).toBeDefined()
    })

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blogs contain populated users', async () => {
        const user = (await helper.usersInDb())[0]
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            userId: user.id
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        const body = ((await api.get('/api/blogs').expect(200)).body)
        blog = body[body.length - 1]
        expect(blog.user.name).toContain(user.name)
        expect(blog.user.username).toContain(user.username)
        expect(blog.user.id).toContain(user.id)
        expect(blog.user.blogs).toBe(undefined)
    })


})
describe('post of blog', () => {
    test('a valid blog can be added', async () => {
        const userId = (await helper.usersInDb())[0].id
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            userId: userId
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        expect(lastBlog.title).toContain(newBlog.title)
        expect(lastBlog.author).toContain(newBlog.author)
        expect(lastBlog.url).toContain(newBlog.url)
        expect(lastBlog.likes).toEqual(newBlog.likes)
    })

    test('blog without content is not added', async () => {
        const userId = (await helper.usersInDb())[0].id
        const newBlog = {
            userId: userId
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without likes defaults to 0', async () => {
        const userId = (await helper.usersInDb())[0].id
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            userId: userId
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        expect(lastBlog.likes).toEqual(0)
    })

    test('a blog missing title and url returns 400', async () => {
        const userId = (await helper.usersInDb())[0].id
        const newBlog = {
            author: "Edsger W. Dijkstra",
            likes: 12,
            userId: userId
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1)

    expect(blogsAtEnd).not.toContainEqual(blogToDelete)
})

test('a blog can be updated', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    let blog = blogsAtBeginning[0]
    blog.likes = 20
    await api
        .put(`/api/blogs/${blog.id}`)
        .send(blog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]
    expect(updatedBlog.likes).toEqual(blog.likes)
})

afterAll(() => {
    mongoose.connection.close()
})