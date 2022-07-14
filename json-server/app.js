const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors")
const app = express()
const PORT = 3000

const offerRouter = require("./routes/Offers")
const answerRouter = require("./routes/Answers")
const userRouter = require("./routes/Users")

function logger(req, res, next) {
    console.log(req.url)
    next()
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use(logger)
// TODO: add user route for pre-connection user authentication
// app.use("/user", userRouter)
app.use("/offers", offerRouter)
app.use("/answers", answerRouter)

app.listen(PORT, () => console.log(`running on port ${PORT}`))