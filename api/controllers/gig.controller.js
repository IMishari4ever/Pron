import Gig from '../models/gig.model.js'
import notificationModel from '../models/notification.model.js'
import userModel from '../models/user.model.js'
import createError from '../utils/createError.js'

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, 'Only sellers can create a gig!'))

  try {
    // Get Admin
    const admin = await userModel.findOne({ role: 'admin' })
    if (!admin._id) return next(createError(403, 'No Admin Found!'))

    // Create New GIG Object
    const newGig = new Gig({
      userId: req.userId,
      ...req.body,
    })

    // Insert notification for admin approval
    await notificationModel.create({
      creator: req.userId,
      user: admin._id,
      gig: newGig._id,
      content: `${req.username} created a new gig, Pending for Approval.`,
      type: 'gig-approval',
    })

    const savedGig = await newGig.save()
    res.status(201).json(savedGig)
  } catch (err) {
    next(err)
  }
}

export const approveGig = async (req, res, next) => {
  if (req.role !== 'admin')
    return next(createError(403, 'User Role Should Be Admin!'))

  try {
    let { gigID, notificationID } = req.params

    // Update Gig Status
    const gig = await Gig.findByIdAndUpdate(
      { _id: gigID },
      { status: true },
      { new: true }
    )

    // Read Notification Status As True
    const notification = await notificationModel.findByIdAndUpdate(
      {
        _id: notificationID,
      },
      { readStatus: true }
    )

    // Dispatch Notifiation for Gig Seller
    await notificationModel.create({
      creator: req.userId,
      user: notification.creator,
      gig: gigID,
      content: `Admin Approved Your Gig!`,
      type: 'gig-approved',
    })

    res.status(201).json(gig)
  } catch (err) {
    next(err)
  }
}

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (gig.userId !== req.userId)
      return next(createError(403, 'You can delete only your gig!'))

    await Gig.findByIdAndDelete(req.params.id)
    res.status(200).send('Gig has been deleted!')
  } catch (err) {
    next(err)
  }
}
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) next(createError(404, 'Gig not found!'))
    res.status(200).send(gig)
  } catch (err) {
    next(err)
  }
}
export const getGigs = async (req, res, next) => {
  const q = req.query
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: 'i' } }),
    status: true,
  }
  try {
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 })
    res.status(200).send(gigs)
  } catch (err) {
    next(err)
  }
}
export const pinGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(id)
    if (!gig) {
      return res.status(404).json({ msg: 'Gig not found' })
    }
    gig.pinned = true
    await gig.save()
    res.json(gig)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Something went wrong')
  }
}
export const pinned = async (req, res, next) => {
  try {
    const pinned = await Gig.find({ pinned: true })

    res.json(pinned)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}
