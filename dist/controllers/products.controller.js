"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.deleteProduct = exports.updateProduct = exports.addProducts = exports.getAllProducts = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = __importDefault(require("../prisma"));
// get all products with pagination
const getAllProducts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    const products = yield prisma_1.default.product.findMany({
        skip: (page && limit) ? (+page - 1) * +limit : 0,
        take: limit ? +limit : 10
    });
    const totalProducts = yield prisma_1.default.product.count();
    return res.status(200).json({
        products,
        count: totalProducts,
        totalPage: Math.ceil(totalProducts / (limit ? +limit : 10)),
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
        message: "Products fetched successfully",
        error: false,
        success: true
    });
}));
exports.getAllProducts = getAllProducts;
// get product details by id
const getProductById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield prisma_1.default.product.findFirst({ where: { id } });
    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            error: true,
            success: false
        });
    }
    return res.status(200).json({
        product,
        message: "Product fetched successfully",
        error: false,
        success: true
    });
}));
exports.getProductById = getProductById;
// add new products in the database
const addProducts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { productId, name, price, description, image, stock, discount, subtitle, category } = req.body;
    if (!(productId && name && price && description && image && stock)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    // check if product already exists
    const isExist = yield prisma_1.default.product.findFirst({ where: { productId } });
    if (isExist) {
        return res.status(409).json({
            message: "Product already exists",
            error: true,
            success: false
        });
    }
    const product = yield prisma_1.default.product.create({
        data: {
            productId,
            name,
            price: +price,
            description,
            image,
            stock: +stock,
            discount: discount ? +discount : 0,
            subtitle,
            category,
        }
    });
    return res.status(201).json({
        product,
        message: "Product added successfully",
        error: false,
        success: true
    });
}));
exports.addProducts = addProducts;
// update product details
const updateProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, price, description, image, stock, discount, subtitle, category } = req.body;
    if (!(name && price && description && image && stock)) {
        return res.status(400).json({
            message: "All fields are required",
            error: true,
            success: false
        });
    }
    // check if product exists or not 
    const isExist = yield prisma_1.default.product.findFirst({ where: { id } });
    if (!isExist) {
        return res.status(404).json({
            message: "Product not found",
            error: true,
            success: false
        });
    }
    const product = yield prisma_1.default.product.update({
        where: { id },
        data: {
            name,
            price,
            description,
            image,
            stock,
            discount,
            subtitle,
            category,
        }
    });
    return res.status(200).json({
        product,
        message: "Product updated successfully",
        error: false,
        success: true
    });
}));
exports.updateProduct = updateProduct;
//  delete product from the database
const deleteProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield prisma_1.default.product.delete({ where: { id } });
    return res.status(200).json({
        product,
        message: "Product deleted successfully",
        error: false,
        success: true
    });
}));
exports.deleteProduct = deleteProduct;
