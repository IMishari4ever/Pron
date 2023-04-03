import createError from '../utils/createError.js'
import Order from '../models/order.model.js'
import Gig from '../models/gig.model.js'
import User from '../models/user.model.js'
import request from 'request-promise'

export const purchaseGig = async (req, res, next) => {
  const gig = await Gig.findById(req.params.id)

  const buyer = await User.findById(req.userId)
  const seller = await User.findById(gig.userId)

  if (buyer.balance < gig.price) {
    return res.status(400).send({ message: 'balance not enough' })
  }

  buyer.balance -= gig.price
  seller.balance += gig.price
  await buyer.save()
  await seller.save()

  // Create new Order
  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    isCompleted: true,
  })

  await newOrder.save()

  res.status(200).send({ message: 'Gig purchased successfully' })
}

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    })

    res.status(200).send(orders)
  } catch (err) {
    next(err)
  }
}

export const makePayment = async (req, res, next) => {
  const paymentData = {
    merchant_email: process.env.MARCHAND_EMAIL,
    secret_key: process.env.SECRET_KEY,
    amount: 100,
    currency: 'USD',
    site_url: 'https://pronazmul.netlify.app',
    title: 'Test Payment',
    order_id: '3214',
    callback_url: 'http://localhost:8800/api/orders/payment-callback',
  }

  try {
    const result = await request.post({
      url: 'https://www.paytabs.com/apiv2/create_pay_page',
      form: paymentData,
    })

    const payTabsResponse = JSON.parse(result)

    if (payTabsResponse.response_code === '4012') {
      console.log(payTabsResponse)
      // Redirect the user to the payment gateway URL
      res.redirect(payTabsResponse.payment_url)
    } else {
      console.log(payTabsResponse)
      // Handle payment initiation error
    }
  } catch (error) {
    console.log(error)
    // Handle other errors
  }
}

export const paymentCallback = async (req, res, next) => {
  const paymentDetails = req.body

  const verifyData = {
    merchant_email: process.env.MARCHAND_EMAIL,
    secret_key: process.env.SECRET_KEY,
    transaction_id: paymentDetails.transaction_id,
  }

  try {
    const result = await request.post({
      url: 'https://www.paytabs.com/apiv2/verify_payment',
      form: verifyData,
    })

    const payTabsResponse = JSON.parse(result)

    if (payTabsResponse.response_code === '100') {
      console.log(payTabsResponse)
      // Payment is successful
    } else {
      console.log(payTabsResponse)
      // Payment verification failed
    }
  } catch (error) {
    console.log(error)
    // Handle other errors
  }
}
