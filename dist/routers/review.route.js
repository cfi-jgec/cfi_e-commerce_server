"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const products_controller_1 = require("../controllers/products.controller");
const router = express_1.default.Router();
// get all reviews
router.route('/').get(products_controller_1.getAllProducts);
router.route('/:id').get(products_controller_1.getProductById);
router.route('/create').post(authentication_1.default, products_controller_1.addProducts);
router.route('/update/:id').patch(authentication_1.default, products_controller_1.updateProduct);
router.route('/delete/:id').post(authentication_1.default, products_controller_1.deleteProduct);
exports.default = router;
