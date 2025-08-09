import Product from '../model/product.model.js';
import mongoose from 'mongoose';

export const createProduct =async (req, res) => {
    const product = req.body;
  if (!product.name || !product.price || !product.image) {  
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }
  const newProduct = new Product(product);
     try {
    
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
     // If there's an error, send a 400 status with the error message
     // This is useful for debugging and informing the client about what went wrong
     // For example, if there's a validation error or a database issue
     // The client can then handle this error appropriately
    res.status(400).json({ success: true, message: error.message });
  }
};

export const getProducts =  async (req, res) => {
  try {
    const products = await Product.find({});
     res.status(200).json({ success: true, data: products });  // Send the products as a JSON response
    } catch (error) {
    res.status(500).json({ success: false, message: error.message }); // Handle any errors that occur during the database query
    }
};

export const updateProduct = async (req, res) => {
	const { id } = req.params;

	const product = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
		res.status(200).json({ success: true, data: updatedProduct });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		await Product.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Product deleted" });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};