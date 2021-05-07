const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
        username: 'root',
        passwordHash
    })

    await user.save()
})

describe('get users', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('property id exists', async () => {
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd[0].id).toBeDefined()
    })

    test('users contains populated blogs', async () => {
        const users = await helper.usersInDb()
        const userId = users[0].id
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
        const usersAtEnd = (await api
            .get('/api/users')
            .expect(200)).body

        const blog = usersAtEnd[0].blogs[0]
        expect(blog.title).toContain(newBlog.title)
        expect(blog.author).toContain(newBlog.author)
        expect(blog.url).toContain(newBlog.url)
        expect(blog.likes).toBe(undefined)
        expect(blog.user).toBe(undefined)
    })
})

describe('post user', () => {

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails if username or password are too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const user1 = {
            username: 'aa',
            name: 'Superuser',
            password: 'salainen',
        }
        const user2 = {
            username: 'aaaa',
            name: 'Superuser',
            password: '12',
        }

        const result1 = await api
            .post('/api/users')
            .send(user1)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result1.body.error).toContain('is shorter than')

        let usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const result2 = await api
            .post('/api/users')
            .send(user2)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result2.body.error).toContain('is shorter than')

        usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})