import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
      type: String,
      required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
});

export default mongoose.model("Ticket", ticketSchema);
