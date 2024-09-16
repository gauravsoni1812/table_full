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
const subcategory = (0, express_1.Router)();
subcategory.post('/', upload_1.upload.single('Image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const { Subcategory_name, Sequence, CategoryId } = req.body;
        const imagePath = req.file ? req.file.path : null;
        const sequenceAsInt = parseInt(Sequence, 10);
        try {
            const response = yield __1.prisma.subcategory.create({
                data: {
                    Subcategory_name,
                    Image: imagePath,
                    Sequence: sequenceAsInt,
                    Category: { connect: { id: Number(CategoryId) } },
                }
            });
            res.status(200).json({
                success: true,
                message: "Subcategory created successfully",
                data: response
            });
        }
        catch (error) {
            res.status(409).json({
                success: false,
                message: "Subcategory already exists",
                error
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create subcategory",
            error
        });
    }
}));
subcategory.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategories = yield __1.prisma.subcategory.findMany(); // Fetch all subcategories
        res.status(200).json({
            success: true,
            data: subcategories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch subcategories",
            error,
        });
    }
}));
subcategory.patch('/:id', upload_1.upload.single('Image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get subcategory ID from URL
        const { Subcategory_name, Sequence, CategoryId } = req.body;
        const imagePath = req.file ? req.file.path : null;
        // Build the update data object dynamically
        const updateData = {};
        if (Subcategory_name)
            updateData.Subcategory_name = Subcategory_name;
        if (Sequence)
            updateData.Sequence = parseInt(Sequence, 10);
        if (CategoryId)
            updateData.Category = { connect: { id: Number(CategoryId) } };
        if (imagePath)
            updateData.Image = imagePath;
        // Update the subcategory in the database
        const updatedSubcategory = yield __1.prisma.subcategory.update({
            where: { id: Number(id) }, // Find the subcategory by ID
            data: updateData, // Update the fields provided
        });
        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            data: updatedSubcategory,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update subcategory",
            error,
        });
    }
}));
subcategory.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get subcategory ID from URL
        // Delete the subcategory from the database
        const deletedSubcategory = yield __1.prisma.subcategory.delete({
            where: { id: Number(id) }, // Find the subcategory by ID
        });
        res.status(200).json({
            success: true,
            message: "Subcategory deleted successfully",
            data: deletedSubcategory, // Optional: return deleted subcategory details
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete subcategory",
            error,
        });
    }
}));
exports.default = subcategory;
