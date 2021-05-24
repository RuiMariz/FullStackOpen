const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    if (body.password.length < 3) {
        response.status(400).json({ error: `User validation failed: password: Path \`password\` (\`${body.password}\`) is shorter than the minimum allowed length (3).` })
        return
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
    if (user) {
        response.json(user.toJSON())
    } else {
        response.status(404).end()
    }
})

module.exports = usersRouter