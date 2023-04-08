import User from '../models/user.model.js'
import createError from '../utils/createError.js'

/**
 * @description Follow a single User
 * @Route [POST]- /api/users/:id/follow
 * @Access protected - [auth]
 * @returns {Object} - {userid, status}
 */
export const follow = async (req, res, next) => {
  try {
    const userId = req.params.id
    // CHECKED THE REQUESTED USER IS LOGGED IN USER OR NOT
    if (userId === req.userId)
      return next(createError(404, "You can't Follow/Unfollow Yourslf!"))

    // CHECK THE USER ALREADY FOLLOWED THE USER OR NOT
    const user = await User.findOne({ _id: userId, followers: req.userId })
    if (user) return next(createError(404, 'You Already Followed the user!'))

    //INSERT FOLLOWERS TO THE REQUESTED USER
    const followers = await User.findByIdAndUpdate(
      userId,
      { $push: { followers: req.userId } },
      { new: true }
    )

    //INSERT FOLLOWING TO LOGGED IN USER
    const following = await User.findByIdAndUpdate(
      req.userId,
      { $push: { following: userId } },
      { new: true }
    )

    res.status(200).json({ followers, following })
  } catch (err) {
    console.log({ err })
    next(createError(500, 'Something Went wrong!'))
  }
}

/**
 * @description Unfollow a single User
 * @Route [POST]- /api/users/:id/follow
 * @Access protected - [auth]
 * @returns {Object} - {followers, following}
 */
export const unfollow = async (req, res, next) => {
  try {
    const userId = req.params.id
    // CHECKED THE REQUESTED USER IS LOGGED IN USER OR NOT
    if (userId === req.userId)
      return next(createError(404, "You can't Follow/Unfollow Yourslf!"))

    // CHECK THE USER FOLLOWED THE USER OR NOT
    const user = await User.findOne({ _id: userId, followers: req.userId })
    if (!user._id) return next(createError(404, "You Didn't Follow the user!"))

    //REMOVE FOLLOWERS TO THE REQUESTED USER
    const followers = await User.findByIdAndUpdate(
      userId,
      { $pull: { followers: req.userId } },
      { new: true }
    )

    //REMOVE FOLLOWING TO LOGGED IN USER
    const following = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { following: userId } },
      { new: true }
    )

    res.status(200).json({ followers, following })
  } catch (err) {
    console.log({ err })
    next(createError(500, 'Something Went wrong!'))
  }
}

/**
 * @description Retrive List of Following of a Individual Users
 * @Route [GET]- /api/users/:id/followings
 * @Access protected - [auth]
 * @returns {JSON} - List of Json Array
 */
export const followingList = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('following')
    if (!user?.following?.length)
      return next(createError(404, 'No Followings Found!'))
    res.status(200).json(user.following)
  } catch (err) {
    console.log({ err })
    next(createError(500, 'Server Error!'))
  }
}

/**
 * @description Retrive List of Followers of a Individual Users
 * @Route [GET]- /api/users/:id/followers
 * @Access protected - [auth]
 * @returns {JSON} - List of Json Array
 */
export const followersList = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('followers')

    if (!user?.followers?.length)
      return next(createError(404, 'No Followers Found!'))

    res.status(200).json(user.followers)
  } catch (err) {
    console.log({ err })
    next(createError(500, 'Server Error!'))
  }
}

//---------------------USER FUNCTIONALITIES--------------------

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

export const balance = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    const amount = req.body.amount
    user.balance += amount
    await user.save()
    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}
