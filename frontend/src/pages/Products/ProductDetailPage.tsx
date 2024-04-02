import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/ProductDetails.css'; // Import CSS file

// Define the type of the product prop
type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    imageUrl: string;
    brand: string; // Add brand to match the ProductDetailPage component
};

// Define the prop type for the ProductDetailPage component
type ProductDetailPageProps = {
    product: Product; // Use the Product type for the product prop
};

// Function component for the ProductDetailPage
const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
    return (
        <div className="container mt-5 mb-5">
            <div className="row d-flex justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="images p-3">
                                    <div className="text-center p-4">
                                        <img id="main-image" src={product.imageUrl} width="250" alt="Main" />
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="product p-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <i className="fa fa-long-arrow-left"></i>
                                            <span className="ml-1">Back</span>
                                        </div>
                                        <i className="fa fa-shopping-cart text-muted"></i>
                                    </div>
                                    <div className="mt-4 mb-3">
                                        <span className="text-uppercase text-muted brand">{product.brand}</span>
                                        <h5 className="text-uppercase">{product.name}</h5>
                                        <div className="price d-flex flex-row align-items-center">
                                            <span className="act-price">${product.price}</span>
                                            {/* Additional discount information if needed */}
                                        </div>
                                    </div>
                                    <p className="about">{product.description}</p>
                                    <div className="sizes mt-5">
                                        <h6 className="text-uppercase">Size</h6>
                                        <label className="radio">
                                            <input type="radio" name="size" value="S" checked />
                                            <span>S</span>
                                        </label>
                                        {/* Additional size options */}
                                    </div>
                                    <div className="cart mt-4 align-items-center">
                                        <button className="btn btn-danger text-uppercase mr-2 px-4">Add to cart</button>
                                        <i className="fa fa-heart text-muted"></i>
                                        <i className="fa fa-share-alt text-muted"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ProductDetailPage;
