import User from '../models/user.model.js'
import createError from '../utils/createError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5)
    const newUser = new User({
      ...req.body,
      password: hash,
    })
    let result = await newUser.save()
    delete result._doc.password
    res
      .status(201)
      .json({ message: 'User Registration Successfull!', data: newUser })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username })

    if (!user) return next(createError(404, 'User not found!'))

    const isCorrect = bcrypt.compareSync(req.body.password, user.password)
    if (!isCorrect) return next(createError(400, 'Wrong password or username!'))

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_KEY
    )
    const { password, ...info } = user._doc

    res
      .cookie('accessToken', token, {
        httpOnly: true,
      })
      .status(200)
      .json(info)
  } catch (err) {
    next(err)
  }
}

export const logout = async (req, res) => {
  res
    .clearCookie('accessToken', {
      sameSite: 'none',
      secure: true,
    })
    .status(200)
    .send('User has been logged out.')
}
