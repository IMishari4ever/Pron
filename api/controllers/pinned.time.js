import cron from 'node-cron'
import Gig from '../models/gig.model.js'
import UserModel from '../models/user.model.js'
import DisputeModel from '../models/dispute.model.js'

const job = cron.schedule('0 0 * * *', async () => {
  const pinnedGigs = await Gig.find({
    pinned: true,
    pinnedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  })

  pinnedGigs.forEach(async (gig) => {
    gig.pinned = false
    await gig.save()
  })

  let disputeOrders = (
    await DisputeModel.find({ status: 'open' }, 'order')
  ).map((i) => i.order)

  // FUNCTIONALITIES FOR GIG PAYMENT AND LEVEL UPGRADUTION:
  let lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000)
  let query = {
    beingCleared: {
      order: { $nin: disputeOrders },
      $elemMatch: {
        clearAt: { $lt: lastDay },
      },
    },
  }
  let users = await UserModel.find(query)
  //BULK WRITE CREATOR IDS IN USER PROFILE
  let updateSelerLevel = users.map((user) => {
    let clearedData = user.beingCleared.filter((u) => u.clearAt < lastDay)

    let beingCleared = user.beingCleared.filter((u) => u.clearAt > lastDay)

    let balance =
      user.balance + clearedData.reduce((acc, curr) => acc + curr.amount, 0)

    let data = {
      balance,
      beingCleared,
    }

    if (balance >= 4000 && user.level !== 'Top Rated') {
      data.level = 'Top Rated'
    } else if (balance >= 1000 && user.level !== 'Level 2') {
      data.level = 'Level 2'
    } else if (balance >= 400 && user.level !== 'Level 1') {
      data.level = 'Level 1'
    }
    return {
      updateOne: {
        filter: {
          _id: user._id,
        },
        update: data,
      },
    }
  })
  await UserModel.bulkWrite(updateSelerLevel)
})

export default job
