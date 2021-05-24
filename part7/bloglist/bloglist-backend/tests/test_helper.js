const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    }
]

const initialUsers = [
    {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "12345678"
    },
    {
        username: "UserName",
        name: "Normal name",
        password: "password"
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const firstUserId = async () => {
    const users = await usersInDb()
    return users[0].id
}

const firstUserToken = async () => {
    const user = {
        username: initialUsers[0].username,
        password: initialUsers[0].password
    }
    return (await api
        .post('/api/login')
        .send(user)).body.token
}

module.exports = {
    initialBlogs, initialUsers, blogsInDb,
    usersInDb, firstUserId, firstUserToken
}