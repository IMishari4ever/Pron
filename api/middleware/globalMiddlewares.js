import morgan from 'morgan'
import cors from 'cors'
import { json, urlencoded } from 'express'
import expressRateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

// Customise Morgan:
morgan.token('timestamp', () => {
  let day = new Date().toDateString()
  let timestamp = new Date().toLocaleTimeString()
  return `${day}- ${timestamp}`
})
const logFormat =
  ':timestamp :method :url :status :res[content-length] - :response-time ms'

/**
 * @Desc: Global Middlewares
 * @middleware : LOGGER MIDDLEWARE
 * @middleware : CORS MIDDLEWARE
 * @middleware : JSON PARSER MIDDLEWARE
 * @middleware : RATE LIMITER MIDDLEWARE
 * @middleware : X URL ENCODED MIDDLEWARE
 */
const globalMiddlewares = [
  cookieParser(),
  morgan(logFormat),
  cors({ origin: 'http://localhost:5173', credentials: true }),
  json(),
  expressRateLimit({
    windowMs: 1 * 60 * 1000, // 1 Munite
    max: 100, // How many Request Excepted Each 1 Munite
    message: 'Too many request from this IP, please try again after 10 Munite',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }),
  urlencoded({ extended: true }),
]
export default globalMiddlewares
