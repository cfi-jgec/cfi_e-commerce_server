import express from 'express';
import dotenv from 'dotenv'
import cors from "cors"

dotenv.config()
const app = express();
const port = process.env.PORT || 8000

// router imports
import ProductRoute from "../routers/review.route"
import AuthRoute from "../routers/auth.route"

// configure middlewares
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cors({
    origin: ['http://localhost:6001'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}))

// declare routes
app.get('/', (req, res) => {
    res.send('Hello World')
})

// routes
app.use('/v1/api/products', ProductRoute);
app.use('/v1/api/auth', AuthRoute);

app.listen(port, () => console.log('🚀[Server]: listening on port ' + port));