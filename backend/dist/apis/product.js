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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const __1 = require("..");
const upload_1 = require("../uploadfunction/upload");
const product = (0, express_1.Router)();
product.post('/', upload_1.upload.single('Image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const { Product_name, Subcategory_id } = req.body;
        const imagePath = req.file ? req.file.path : null;
        try {
            const response = yield __1.prisma.product.create({
                data: {
                    Product_name,
                    Image: imagePath,
                    Subcategory: { connect: { id: Number(Subcategory_id) } },
                }
            });
            res.status(200).json({
                success: true,
                message: "Product created successfully",
                data: response
            });
        }
        catch (error) {
            res.status(409).json({
                success: false,
                message: "Product already exists",
                error
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error
        });
    }
}));
product.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield __1.prisma.product.findMany(); // Fetch all products
        res.status(200).json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error,
        });
    }
}));
product.patch('/:id', upload_1.upload.single('Image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get product ID from URL
        const { Product_name, Subcategory_id } = req.body;
        const imagePath = req.file ? req.file.path : null;
        // Build the update data object dynamically
        const updateData = {};
        if (Product_name)
            updateData.Product_name = Product_name;
        if (Subcategory_id)
            updateData.Subcategory = { connect: { id: Number(Subcategory_id) } };
        if (imagePath)
            updateData.Image = imagePath;
        // Update the product in the database
        const updatedProduct = yield __1.prisma.product.update({
            where: { id: Number(id) }, // Find the product by ID
            data: updateData, // Update the fields provided
        });
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error,
        });
    }
}));
product.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get product ID from URL
        // Delete the product from the database
        const deletedProduct = yield __1.prisma.product.delete({
            where: { id: Number(id) }, // Find the product by ID
        });
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct, // Optional: return deleted product details
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error,
        });
    }
}));
exports.default = product;
