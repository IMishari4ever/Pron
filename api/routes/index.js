import { Router } from 'express'

import userRoute from './user.route.js'
import gigRoute from './gig.route.js'
import orderRoute from './order.route.js'
import ticketRouter from './ticket.route.js'
import community from './community.router.js'

import conversationRoute from './conversation.route.js'
import messageRoute from './message.route.js'
import reviewRoute from './review.route.js'
import authRoute from './auth.route.js'
import disputeRoute from './disputes.route.js'

const routes = Router()

//Health Checker
routes.use('/health', (_req, res) => res.status(200).json({ status: 'ok' }))

// Application Routes
routes.use('/api/auth', authRoute)
routes.use('/api/users', userRoute)
routes.use('/api/tickets', ticketRouter)
routes.use('/api/community', community)

routes.use('/api/gigs', gigRoute)
routes.use('/api/orders', orderRoute)
routes.use('/api/conversations', conversationRoute)
routes.use('/api/messages', messageRoute)
routes.use('/api/reviews', reviewRoute)

// New Features
routes.use('/api/disputes', disputeRoute)
// routes.use('/api/levels')
// routes.use('/api/favourites')

// Module Exports
export default routes
