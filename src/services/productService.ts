import Product from "../models/Product";

interface ProductData {
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  discount: number;
  category: string;
  image: string;
  stock: number;
  ageRange: string;
}

const saveProduct = async (productData: ProductData) => {
  const product = new Product(productData);
  return await product.save();
};

const getAllProducts = async (ageRange?: string) => {
  if (ageRange) {
    return await Product.find({ ageRange });
  }

  return await Product.find();
};

const getProductById = async (productId: string) => {
  return await Product.findById(productId);
};

const updateProduct = async (
  productId: string,
  productData: Partial<ProductData>
) => {
  return await Product.findByIdAndUpdate(
    productId,
    productData,
    { new: true, runValidators: true }
  );
};

const deleteProduct = async (productId: string) => {
  return await Product.findByIdAndDelete(productId);
};

export default {
  saveProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
