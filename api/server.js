import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import errorHandler from './middleware/errorHandler.js'
import globalMiddlewares from './middleware/globalMiddlewares.js'
import routes from './routes/index.js'
import databaseConnection from './config/db.js'
import pinJob from './controllers/pinned.time.js'
const app = express()
dotenv.config()

// DataBase Connection
databaseConnection()

// Global MIDDLEWARES
app.use(globalMiddlewares)

// Application Routes:
app.use(routes)

// Global Error Handler
app.use(errorHandler)

app.listen(8800, () => {
  console.log(`SERVER IS RUNNING ON 8800`.rainbow.bold)
})

pinJob.start()
