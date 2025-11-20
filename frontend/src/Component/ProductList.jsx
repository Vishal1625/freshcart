import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container my-5">
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map((product) => (
          <div className="col" key={product._id}>
            <div className="card card-product h-100">
              <div className="card-body text-center position-relative">
                {/* Badge */}
                {product.badge && (
                  <div className="position-absolute top-0 start-0">
                    <span className="badge bg-danger">{product.badge}</span>
                  </div>
                )}

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="mb-3 img-fluid"
                />

                {/* Category */}
                <div className="text-small mb-1">
                  <small className="text-muted">{product.category}</small>
                </div>

                {/* Product Name */}
                <h6 className="fs-6">{product.name}</h6>

                {/* Ratings */}
                <div className="text-warning">
                  {[...Array(5)].map((_, i) => {
                    const fullStar = i < Math.floor(product.rating);
                    const halfStar =
                      i >= Math.floor(product.rating) &&
                      i < product.rating;
                    return (
                      <i
                        key={i}
                        className={`bi ${
                          fullStar
                            ? "bi-star-fill"
                            : halfStar
                            ? "bi-star-half"
                            : "bi-star"
                        }`}
                      />
                    );
                  })}
                  <span className="text-muted small">
                    {" "}
                    ({product.rating?.toFixed(1)}) {product.reviews}
                  </span>
                </div>

                {/* Price + Add Button */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <span className="text-dark">${product.price}</span>{" "}
                    {product.oldPrice && (
                      <span className="text-decoration-line-through text-muted">
                        ${product.oldPrice}
                      </span>
                    )}
                  </div>
                  <button className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-lg"></i> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
