import User from '../models/user.model.js'
import createError from '../utils/createError.js'

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (req.userId !== user._id.toString()) {
    return next(createError(403, 'You can delete only your account!'))
  }
  await User.findByIdAndDelete(req.params.id)
  res.status(200).send('deleted.')
}

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id)
  res.status(200).send(user)
}

export const allUser = async (req, res, next) => {
  const { userId, isSeller, role } = req
  console.log({ userId, isSeller, role })

  const user = await User.find(
    {},
    'username role email img country phone desc isSeller'
  )
  res.status(200).json(user)
}
