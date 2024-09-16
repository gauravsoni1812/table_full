import { Router } from "express";
import { prisma } from "..";
import { upload } from "../uploadfunction/upload";

const subcategory = Router();

subcategory.post('/', upload.single('Image'), async (req, res) => {
    try {
        //@ts-ignore
        const { Subcategory_name, Sequence, CategoryId } = req.body;
        const imagePath = req.file ? req.file.path : null;
        const sequenceAsInt = parseInt(Sequence, 10);
         
        try {
            const response = await prisma.subcategory.create({
                data : {
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
        } catch (error) {
            res.status(409).json({
                success: false,
                message: "Subcategory already exists",
                error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create subcategory",
            error
        });
    }
});

subcategory.get('/', async (req, res) => {
    try {
        const subcategories = await prisma.subcategory.findMany(); // Fetch all subcategories
        res.status(200).json({
            success: true,
            data: subcategories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch subcategories",
            error,
        });
    }
});

subcategory.patch('/:id', upload.single('Image'), async (req, res) => {
    try {
        const { id } = req.params; // Get subcategory ID from URL
        const { Subcategory_name, Sequence, CategoryId } = req.body;
        const imagePath = req.file ? req.file.path : null;

        // Build the update data object dynamically
        const updateData: any = {};
        if (Subcategory_name) updateData.Subcategory_name = Subcategory_name;
        if (Sequence) updateData.Sequence = parseInt(Sequence, 10);
        if (CategoryId) updateData.Category = { connect: { id: Number(CategoryId) } };
        if (imagePath) updateData.Image = imagePath;

        // Update the subcategory in the database
        const updatedSubcategory = await prisma.subcategory.update({
            where: { id: Number(id) }, // Find the subcategory by ID
            data: updateData, // Update the fields provided
        });

        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            data: updatedSubcategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update subcategory",
            error,
        });
    }
});

subcategory.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get subcategory ID from URL

        // Delete the subcategory from the database
        const deletedSubcategory = await prisma.subcategory.delete({
            where: { id: Number(id) }, // Find the subcategory by ID
        });

        res.status(200).json({
            success: true,
            message: "Subcategory deleted successfully",
            data: deletedSubcategory, // Optional: return deleted subcategory details
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete subcategory",
            error,
        });
    }
});

export default subcategory;

