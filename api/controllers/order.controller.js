import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import User from '../models/user.model.js'

export const purchaseGig = async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);
  
  const buyer = await User.findById(req.userId);
  const seller = await User.findById(gig.userId);

  if (buyer.balance < gig.price) {
    return res.status(400).send({ message: 'balance not enough' });
  }

  buyer.balance -= gig.price;
  seller.balance += gig.price;
  await buyer.save();
  await seller.save();

  // Create new Order
  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    isCompleted: true,
  });

  await newOrder.save();

  res.status(200).send({ message: 'Gig purchased successfully' });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};
