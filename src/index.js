const app = require('./servidor')

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Running on port ${PORT} 🚀`)
})