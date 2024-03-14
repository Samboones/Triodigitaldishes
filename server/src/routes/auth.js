import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user'
import keys from '../config/keys'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.route('/').get((req, res, next) => {
    res.send('auth endpoint')
})

router.post('/signup', async (req, res) => {
    const { username, password, confirmPassword, email } = req.body

    if (!password || !username || !email || !confirmPassword) {
        return res.status(401).json({ error: 'please add all the fields' })
    }
    if (password != confirmPassword) {
        return res.status(401).json({ error: "Passwords don't match! Please try again." })
    } else if (password !== confirmPassword) {
        return res.status(422).json({ error: 'Your passwords must match.' })
    }

    User.findOne({ $or: [{ username: username }, { email: email }] })
        .then((savedUser) => {
            if (savedUser) {
                return res
                    .status(422)
                    .json({ error: 'user already exists with that name/email' })
            }
            bcrypt.hash(password, 12).then((hashedpassword) => {
                const user = new User({
                    username,
                    email,
                    passwordHash: hashedpassword,
                    confirmPassword
                })

                user
                    .save()
                    .then((user) => {
                        res.json({ message: 'saved successfully' })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
        })
        .catch((err) => {
            console.log(err)
        })
})

router.post('/signin', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(422).json({ error: 'missing username or password' })
    }

    const user = await User.findOne({ username: username })
    const passwordCorrect =
        user === null ? false : await bcrypt.compare(password, user.passwordHash)


    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password',
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, keys.jwt.secret)
    res
        .status(200)
        .send({ token, username, uid: user.id })
})

module.exports = router

