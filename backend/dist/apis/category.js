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
const category = (0, express_1.Router)();
category.post('/', upload_1.upload.single('Image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.Id;
        const { Category_name, Sequence } = req.body;
        const imagePath = req.file ? req.file.path : null;
        const sequenceAsInt = parseInt(Sequence, 10);
        try {
            const response = yield __1.prisma.category.create({
                data: {
                    Category_name,
                    Image: imagePath,
                    Sequence: sequenceAsInt,
                    userId
                }
            });
            console.log({ response });
            if (response.Status) {
                res.status(200).json({
                    success: true,
                    message: "success",
                });
            }
            else {
                res.status(409).json({
                    success: false,
                    message: "Category already exists",
                });
            }
        }
        catch (error) {
            res.status(502).json({
                error,
                success: false,
                msg: "Invalid Data",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: "Authentication failed",
        });
    }
}));
category.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield __1.prisma.category.findMany(); // Fetch all categories
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error,
        });
    }
}));
category.patch('/:id', upload_1.upload.single('Image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get category ID from URL
        const { Category_name, Sequence } = req.body;
        const imagePath = req.file ? req.file.path : null; // Check if a new image was uploaded
        // Build the update data object dynamically
        const updateData = {};
        if (Category_name)
            updateData.Category_name = Category_name;
        if (Sequence)
            updateData.Sequence = parseInt(Sequence, 10);
        if (imagePath)
            updateData.Image = imagePath;
        // Update the category in the database
        const updatedCategory = yield __1.prisma.category.update({
            where: { id: Number(id) }, // Find the category by ID
            data: updateData, // Update the fields provided
        });
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update category",
            error,
        });
    }
}));
category.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get category ID from URL
        // Delete the category from the database
        const deletedCategory = yield __1.prisma.category.delete({
            where: { id: Number(id) }, // Find the category by ID
        });
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: deletedCategory, // Optional: return deleted category details
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error,
        });
    }
}));
exports.default = category;
