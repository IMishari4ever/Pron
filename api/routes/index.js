import { Router } from 'express'

import userRoute from './user.route.js'
import gigRoute from './gig.route.js'
import orderRoute from './order.route.js'
import ticketRouter from './ticket.route.js'
import withdrawRouter from './withdraw.route.js'
import community from './community.router.js'

import conversationRoute from './conversation.route.js'
import messageRoute from './message.route.js'
import reviewRoute from './review.route.js'
import authRoute from './auth.route.js'
import disputeRoute from './disputes.route.js'
import notificationRoute from './notification.route.js'

const routes = Router()

//Health Checker
routes.use('/health', (_req, res) => res.status(200).json({ status: 'ok' }))

// Application Routes
routes.use('/api/v1/auth', authRoute)
routes.use('/api/v1/users', userRoute)
routes.use('/api/v1/tickets', ticketRouter)
// **
routes.use('/api/v1/withdraw', withdrawRouter)
routes.use('/api/v1/community', community)
routes.use('/api/v1/gigs', gigRoute)
routes.use('/api/v1/orders', orderRoute)
routes.use('/api/v1/conversations', conversationRoute)
routes.use('/api/v1/messages', messageRoute)
routes.use('/api/v1/reviews', reviewRoute)
routes.use('/api/v1/notifications', notificationRoute)

// New Features
routes.use('/api/v1/disputes', disputeRoute)

// Module Exports
export default routes
