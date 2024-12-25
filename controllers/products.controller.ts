import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../prisma";

// get all products with pagination
const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const products = await prisma.product.findMany({
        skip: (page && limit) ? (+page - 1) * +limit : 0,
        take: limit ? +limit : 10
    });
    const totalProducts = await prisma.product.count();
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
});

// get product details by id
const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.findFirst({ where: { id } });
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
});

// add new products in the database
const addProducts = asyncHandler(async (req: Request, res: Response) => {
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
    const isExist = await prisma.product.findFirst({ where: { productId } });
    if (isExist) {
        return res.status(409).json({
            message: "Product already exists",
            error: true,
            success: false
        });
    }

    const product = await prisma.product.create({
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
});

// update product details
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
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
    const isExist = await prisma.product.findFirst({ where: { id } });
    if (!isExist) {
        return res.status(404).json({
            message: "Product not found",
            error: true,
            success: false
        });
    }

    const product = await prisma.product.update({
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
});

//  delete product from the database
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.delete({ where: { id } });
    return res.status(200).json({
        product,
        message: "Product deleted successfully",
        error: false,
        success: true
    });
});

export { getAllProducts, addProducts, updateProduct, deleteProduct, getProductById };