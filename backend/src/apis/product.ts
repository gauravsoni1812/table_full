import { Router } from "express";
import { prisma } from "..";
import { upload } from "../uploadfunction/upload";

const product = Router();

product.post('/', upload.single('Image'), async (req, res) => {
    try {
        //@ts-ignore
        const { Product_name, Subcategory_id } = req.body;
        const imagePath = req.file ? req.file.path : null;

        try {
            const response = await prisma.product.create({
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
        } catch (error) {
            res.status(409).json({
                success: false,
                message: "Product already exists",
                error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error
        });
    }
});

product.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany(); // Fetch all products
        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error,
        });
    }
});

product.patch('/:id', upload.single('Image'), async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from URL
        const { Product_name, Subcategory_id } = req.body;
        const imagePath = req.file ? req.file.path : null;

        // Build the update data object dynamically
        const updateData: any = {};
        if (Product_name) updateData.Product_name = Product_name;
        if (Subcategory_id) updateData.Subcategory = { connect: { id: Number(Subcategory_id) } };
        if (imagePath) updateData.Image = imagePath;

        // Update the product in the database
        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) }, // Find the product by ID
            data: updateData, // Update the fields provided
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error,
        });
    }
});
product.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from URL

        // Delete the product from the database
        const deletedProduct = await prisma.product.delete({
            where: { id: Number(id) }, // Find the product by ID
        });

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct, // Optional: return deleted product details
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error,
        });
    }
});

export default product;
