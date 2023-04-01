// Required Packeges
import mongoose from 'mongoose'
mongoose.set('strictQuery', true)

/**
 * @description: DATABASE CONNECTION
 */
const databaseConnection = async () => {
  try {
    const OPTIONS = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: '',
      pass: '',
    }
    let db = await mongoose.connect(process.env.MONGO_URI, OPTIONS)
    console.log(
      `MongoDB Successfully Connected with ${mongoose.connection.name}`.green
        .bold
    )
  } catch (error) {
    console.log(`Error ${error.message}`.red.bold)
    process.exit(1)
  }
}

export default databaseConnection
