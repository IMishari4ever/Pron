import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    img: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: String,
    },
    desc: {
      type: String,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
    beingCleared: [
      {
        amount: { type: Number, required: true },
        clearAt: {
          type: Date,
          default: () => Date.now() + 14 * 24 * 60 * 60 * 1000,
        },
      },
    ],
    level: {
      type: String,
      enum: ['New Seller', 'Level 1', 'Level 2', 'Top Rated'],
      default: 'New Seller',
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', userSchema)
