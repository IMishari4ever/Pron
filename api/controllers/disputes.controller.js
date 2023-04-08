import DisputeModel from '../models/dispute.model.js'
import createError from './../utils/createError.js'

/**
 * @desc Create
 * @Route [POST]- /api/disputes
 * @Access protected - [auth]
 * @returns {OBJECT}
 */
export const create = async (req, res, next) => {
  try {
    let newData = new DisputeModel({ ...req.body, user: req.userId })
    await newData.save()
    res.status(201).json({ status: 'success', data: newData })
  } catch (error) {
    next(createError(500, error.message))
  }
}

/**
 * @description Get Single Data
 * @Route [GET]- /api/disputes/:disputeID
 * @Access protected - [auth]
 * @returns {Object}
 */
export const singleData = async (req, res, next) => {
  try {
    let query = { _id: req.params.disputeID }
    const data = await DisputeModel.findOne(query)
    res.status(200).json({ status: 'success', data })
  } catch (error) {
    next(createError(500, error.message))
  }
}

/**
 * @desc Get All Data
 * @Route [GET]- /api/disputes?user=userID&seller=sellerID&buyer=buyerID&status=open||resolved
 * @Access protected - [auth]
 * @returns {Array<JSON>}
 */
export const allData = async (req, res, next) => {
  try {
    const { user, seller, buyer, status, page = 1, limit = 10 } = req.query

    let query = {}
    let projection = {}
    const options = { sort: { createdAt: 1 } }

    // SET FILTERING OPETIONS IF PROVIDE FROM CLIENT SIDE:
    if (user) query = { ...query, user }
    if (seller) query = { ...query, seller }
    if (buyer) query = { ...query, buyer }
    if (status) query = { ...query, status }

    // COUNT TOTAL DOCUMENTS FOR PAGINATION
    const totalCount = await DisputeModel.countDocuments(query)

    //FIND DATA FROM DATABASE
    const data = await DisputeModel.find(query, projection, options)
      .limit(limit)
      .skip(limit * (page - 1))

    res.set('x-total-count', totalCount)

    if (totalCount) {
      return res.status(200).json({ status: 'success', data })
    }
    return next(createError(404, 'No data found!'))
  } catch (error) {
    next(createError(500, error.message))
  }
}

/**
 * @desc Update Data
 * @Route [PUT]- /api/disputes/:disputeID
 * @Access protected - [auth]
 * @returns {JSON} - Updated Object
 */
export const updateOne = async (req, res, next) => {
  try {
    let query = { _id: req.params.id }
    let data = { ...req.body }
    let options = {
      new: true,
    }
    let result = await DisputeModel.findOneAndUpdate(query, data, options)
    res.status(200).json({ status: 'success', result })
  } catch (error) {
    next(createError(500, error.message))
  }
}
