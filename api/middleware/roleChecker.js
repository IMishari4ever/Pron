// External Modules
import createError from '../utils/createError.js'

/**
 * @desc Authorization Checker Middleware
 * @param {Array<string>} roles
 * @returns next middleware
 */
const authorize = (role) => {
  return (req, res, next) => {
    if (req.role !== role) {
      return next(
        new createError(
          'You do not have permission to perform this action',
          403
        )
      )
    }

    next()
  }
}

export const canReadTicket = (user, ticket, id) => {
  return user === 'admin' || ticket.createdBy === id
}

export default authorize
