import { PORT } from './config/index.js'
import { app } from './server.js'

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`)
})
