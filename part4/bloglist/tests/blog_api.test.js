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
        const usersAtStart = await helper.usersInDb()
        const userId = usersAtStart[0].id
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            userId: userId
        }
        const user = {
            username: "mluukkai",
            password: "12345678"
        }
        const token = (await api
            .post('/api/login')
            .send(user)).body.token
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)

        const body = ((await api.get('/api/blogs').expect(200)).body)
        blog = body[body.length - 1]
        expect(blog.user.name).toContain(usersAtStart[0].name)
        expect(blog.user.username).toContain(usersAtStart[0].username)
        expect(blog.user.id).toContain(usersAtStart[0].id)
        expect(blog.user.blogs).toBe(undefined)
    })


})
describe('post of blog', () => {
    test('a valid blog can be added', async () => {
        const usersAtStart = await helper.usersInDb()
        const userId = usersAtStart[0].id
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            userId: userId
        }
        const user = {
            username: "mluukkai",
            password: "12345678"
        }
        const token = (await api
            .post('/api/login')
            .send(user)).body.token
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
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without content is not added', async () => {
        const userId = (await helper.usersInDb())[0].id
        const newBlog = {
            userId: userId
        }
        const user = {
            username: "mluukkai",
            password: "12345678"
        }
        const token = (await api
            .post('/api/login')
            .send(user)).body.token

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
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
        const user = {
            username: "mluukkai",
            password: "12345678"
        }
        const token = (await api
            .post('/api/login')
            .send(user)).body.token

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
        const userId = (await helper.usersInDb())[0].id
        const newBlog = {
            author: "Edsger W. Dijkstra",
            likes: 12,
            userId: userId
        }
        const user = {
            username: "mluukkai",
            password: "12345678"
        }
        const token = (await api
            .post('/api/login')
            .send(user)).body.token

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
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
    const usersAtStart = await helper.usersInDb()
    const userId = usersAtStart[0].id
    const user = {
        username: "mluukkai",
        password: "12345678"
    }
    const token = (await api
        .post('/api/login')
        .send(user)).body.token

    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 20,
        userId: userId
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
    const blogs = await helper.blogsInDb()

    await api
        .delete(`/api/blogs/${blogs[blogs.length - 1].id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length)
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