import User from '../models/user.model.js'
import createError from '../utils/createError.js'

/**
 * @desc Create
 * @Route [POST]- /api/favourites/add/:id
 * @Access protected - [auth]
 * @returns {OBJECT}
 */
export const create = async (req, res, next) => {
  try {
    const gigID = req.params.id
    const userID = req.userId

    // CHECK ALREADY FAVOURITED THE GIG OR NOT
    const favourited = await User.findOne({
      _id: userID,
      wishlist: gigID,
    })
    if (favourited)
      return next(createError(400, 'Already added on favourite list!'))

    const user = await User.findByIdAndUpdate(
      userID,
      { $push: { wishlist: gigID } },
      { new: true }
    )

    res.status(200).json(user)
  } catch (error) {
    next(createError(500, 'Internal Server Error!'))
  }
}

/**
 * @desc Get All Data
 * @Route [GET]- /api/favourites/remove/:id
 * @Access protected - [auth]
 * @returns {Array<JSON>}
 */
export const getAll = async (req, res, next) => {
  try {
    const userID = req.userId
    const user = await User.findById(userID).populate(' wishlist')
    res.status(200).json(user)
  } catch (error) {
    next(createError(500, 'Internal Server Error!'))
  }
}

/**
 * @desc Delete single
 * @Route [DELETE]- /api/favourites/remove/:id
 * @Access protected - [auth]
 * @returns {Boolean}
 */
export const deleteSingle = async (req, res, next) => {
  try {
    const gigID = req.params.id
    const userID = req.userId

    const user = await User.findByIdAndUpdate(
      userID,
      { $pull: { wishlist: gigID } },
      { new: true }
    )

    if (user) {
      return res.status(200).json(user)
    } else {
      next(createError(500, 'Data not found!'))
    }
  } catch (error) {
    next(createError(500, 'Internal Server Error!'))
  }
}

/**
 * @desc Delete All
 * @Route [DELETE]- /api/favourites/destroy
 * @Access protected - [auth]
 * @returns {Boolean}
 */
export const deleteAll = async (req, res, next) => {
  try {
    const gigID = req.params.id
    const userID = req.userId

    const user = await User.findByIdAndUpdate(
      userID,
      { wishlist: [] },
      { new: true }
    )
    return res.status(200).json(user)
  } catch (error) {
    next(createError(500, 'Internal Server Error!'))
  }
}
