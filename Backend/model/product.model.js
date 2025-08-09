import mongoose from "mongoose";    

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  } ,
  price:{
    type: Number,
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
},{
    timestamps: true// Automatically add createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);
// Create a model named 'Product' refers to products in the database
// The model is based on the productSchema defined above
export default Product;
// Exporting the Product model to be used in other parts of the application