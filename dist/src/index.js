"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// router imports
const review_route_1 = __importDefault(require("../routers/review.route"));
const auth_route_1 = __importDefault(require("../routers/auth.route"));
// configure middlewares
app.use(express_1.default.json({ limit: '16kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '16kb' }));
app.use((0, cors_1.default)({
    origin: ['http://localhost:6001'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));
// declare routes
app.get('/', (req, res) => {
    res.send('Hello World');
});
// routes
app.use('/v1/api/products', review_route_1.default);
app.use('/v1/api/auth', auth_route_1.default);
app.listen(port, () => console.log('🚀[Server]: listening on port ' + port));
