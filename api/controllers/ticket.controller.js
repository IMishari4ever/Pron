import Ticket from '../models/ticket.model.js'
import { canReadTicket } from './../middleware/roleChecker.js'

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body
    const creator = req.userId
    const ticket = new Ticket({
      createdBy: req.userId,
      ...req.body,
    })
    const savedTicket = await ticket.save()
    res.status(201).json(savedTicket)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params

    const ticket = await Ticket.findById(id).populate('createdBy')
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }
    if (!canReadTicket(req.role, ticket, req.userId)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    res.json({ ticket })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('createdBy')
    res.json({ tickets })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
