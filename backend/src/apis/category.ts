import { Router } from "express";
import { prisma } from "..";

import { upload } from "../uploadfunction/upload";


const category = Router();

category.post('/', upload.single('Image'), async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.Id;
        const {Category_name,Sequence} = req.body;
        const imagePath = req.file ? req.file.path : null;
        const sequenceAsInt = parseInt(Sequence, 10);

        try {
            const response = await prisma.category.create({
                data : {
                    Category_name,
                    Image:imagePath,
                    Sequence:sequenceAsInt,
                    userId
                }
            });
            console.log({response})
            if (response.Status){
                res.status(200).json({
                    success: true,
                    message: "success",
                });
            }else{
                res.status(409).json({
                    success: false,
                    message: "Category already exists",
                });
            }
            
        } catch (error) {
            res.status(502).json({
                error,
                success: false,
                msg: "Invalid Data",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Authentication failed",
        });
    }
})

category.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany(); // Fetch all categories
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error,
        });
    }
});

category.patch('/:id', upload.single('Image'), async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from URL
        const { Category_name, Sequence } = req.body;
        const imagePath = req.file ? req.file.path : null; // Check if a new image was uploaded

        // Build the update data object dynamically
        const updateData: any = {};
        if (Category_name) updateData.Category_name = Category_name;
        if (Sequence) updateData.Sequence = parseInt(Sequence, 10);
        if (imagePath) updateData.Image = imagePath;

        // Update the category in the database
        const updatedCategory = await prisma.category.update({
            where: { id: Number(id) }, // Find the category by ID
            data: updateData, // Update the fields provided
        });

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update category",
            error,
        });
    }
});

category.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from URL

        // Delete the category from the database
        const deletedCategory = await prisma.category.delete({
            where: { id: Number(id) }, // Find the category by ID
        });

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: deletedCategory, // Optional: return deleted category details
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error,
        });
    }
});


export default category;  