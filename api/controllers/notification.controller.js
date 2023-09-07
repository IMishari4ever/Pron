import NotificationModel from '../models/notification.model.js'

export const getNotifications = async (req, res, next) => {
  try {
    const messages = await NotificationModel.find({
      user: req.userId,
      readStatus: false,
    })
    res.status(200).send(messages)
  } catch (err) {
    next(err)
  }
}

export const readNotification = async (req, res, next) => {
  try {
    await NotificationModel.updateOne(
      {
        _id: req.params.id,
      },
      { readStatus: true }
    )

    res.status(200).send({
      message: 'Notification Read Success!',
    })
  } catch (err) {
    next(err)
  }
}
