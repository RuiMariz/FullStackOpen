const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeAll(async () => {
    await User.deleteMany({})

    for (let user of helper.initialUsers) {
        await api
            .post("/api/users")
            .send(user)
    }
})

beforeEach(async () => {
    await Blog.deleteMany({})
    const userId = await helper.firstUserId()
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    for (let blog of blogObjects) {
        blog.user = userId
    }
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
        const body = ((await api.get('/api/blogs').expect(200)).body)
        const blog = body[0]
        expect(blog.user.name).toContain(user.name)
        expect(blog.user.username).toContain(user.username)
        expect(blog.user.id).toContain(user.id)
        expect(blog.user.blogs).toBe(undefined)
    })

    test('a specific blog can be viewed', async () => {
        const blogToView = (await helper.blogsInDb())[0]
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultBlog.body.title).toContain(blogToView.title)
        expect(resultBlog.body.author).toContain(blogToView.author)
        expect(resultBlog.body.url).toContain(blogToView.url)
        expect(resultBlog.body.likes).toBe(blogToView.likes)
        expect(resultBlog.body.user).toContain(blogToView.user)
    })
})
describe('post of blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            userId: await helper.firstUserId()
        }
        const token = await helper.firstUserToken()
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
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

    test('blog without token returns 401', async () => {
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            userId: await helper.firstUserId()
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without content is not added', async () => {
        const newBlog = {
            userId: await helper.firstUserId()
        }
        const token = await helper.firstUserToken()

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without likes defaults to 0', async () => {
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            userId: await helper.firstUserId()
        }
        const token = await helper.firstUserToken()

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        expect(lastBlog.likes).toEqual(0)
    })

    test('a blog missing title and url returns 400', async () => {
        const newBlog = {
            author: "Edsger W. Dijkstra",
            likes: 12,
            userId: await helper.firstUserId()
        }
        const token = await helper.firstUserToken()

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

test('a blog can be deleted', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const token = await helper.firstUserToken()

    await api
        .delete(`/api/blogs/${blogsAtBeginning[0].id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        blogsAtBeginning.length - 1)
})

test('a blog can be updated', async () => {
    let blog = (await helper.blogsInDb())[0]
    const token = await helper.firstUserToken()
    blog.likes = 20
    await api
        .put(`/api/blogs/${blog.id}`)
        .set('Authorization', `bearer ${token}`)
        .send(blog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const updatedBlog = (await helper.blogsInDb())[0]
    expect(updatedBlog.likes).toEqual(blog.likes)
})

afterAll(async() => {
    mongoose.connection.close()
})