import mongoose from 'mongoose'

const communityTicket = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
})

export default mongoose.model('Community', communityTicket)
