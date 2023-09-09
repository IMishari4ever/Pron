import userModel from '../models/user.model.js'
import notificationModel from '../models/notification.model.js'

export const withdrawAmount = async (req, res) => {
  try {
    let { method, amount } = req.body

    // GET user Anc chek available amount
    const user = await userModel.findOne({
      _id: req.userId,
      balance: { $gte: amount },
    })

    if (!user?._id) return next(createError(403, 'Insufficient Ammount!'))

    // Get Admin
    const admin = await userModel.findOne({ role: 'admin' })
    if (!admin._id) return next(createError(403, 'No Admin Found!'))

    // Insert notification for admin approval
    await notificationModel.create({
      creator: req.userId,
      user: admin._id,
      content: `${req.username} Requested for Payment ${amount} by ${method}.`,
      amount: amount,
      method: method,
      type: 'payment-approval',
    })

    return res
      .status(200)
      .json({ message: 'Your payment Request Has Been Submitted!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

export const approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params
    const userID = req.userId

    // Read Notification
    const notification = await notificationModel.findByIdAndUpdate(
      { _id: id, readStatus: false },
      { readStatus: true },
      { new: true }
    )
    if (!notification?._id) return next(createError(403, 'No Notification'))

    // Reduce Amount from User
    await userModel.updateOne(
      { _id: notification?.creator },
      { $inc: { balance: -notification?.amount } }
    )

    // Approval Confermation to user
    await notificationModel.create({
      creator: notification?.user,
      user: notification?.creator,
      content: `Congreats! Admin Accept Your Payment Request`,
      amount: notification?.amount,
      method: notification?.method,
      type: 'payment-approval',
    })

    res.status(200).json({ error: 'Approve Success' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
