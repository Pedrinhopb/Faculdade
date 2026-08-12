const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI

    // garante que a variável está definida antes de conectar
    if (!uri) {
      console.error('❌ MONGO_URI não definida — configure o arquivo .env')
      console.error('   Exemplo: MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/stockeasy')
      process.exit(1)
    }

    await mongoose.connect(uri, { family: 4 })
    console.log('✅ MongoDB conectado')
  } catch (err) {
    console.error('⚠️ MongoDB offline — tentando reconectar em 5s...')
    setTimeout(connectDB, 5000)
  }
}

module.exports = connectDB