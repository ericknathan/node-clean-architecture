import app from './config/app'
const PORT = process.env.PORT || 5050

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
