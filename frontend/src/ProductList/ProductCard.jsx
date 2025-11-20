import React, { useState } from "react";
import axios from "axios";
// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";
export default function ProductCard({ product }) {
  const [previewImage, setPreviewImage] = useState(product.image || "");
  const [uploading, setUploading] = useState(false);

  const handleAddClick = () => alert(`${product.name} added to cart!`);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPreviewImage(`http://localhost:5000${res.data.imageUrl}`);
      alert("✅ Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="col-md-3 mb-4">
      <div className="card border shadow-sm h-100">
        <div className="position-relative">
          <img
            src={previewImage}
            className="card-img-top"
            alt={product.name}
            style={{ height: "150px", objectFit: "contain" }}
          />

          <label
            htmlFor={`upload-${product.id}`}
            className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 shadow-sm"
            style={{ borderRadius: "50%" }}
          >
            {uploading ? (
              <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>
            ) : (
              <i className="bi bi-camera"></i>
            )}
          </label>

          <input
            type="file"
            id={`upload-${product.id}`}
            accept="image/*"
            onChange={handleImageUpload}
            className="d-none"
          />
        </div>

        <div className="card-body">
          <div className="text-small mb-1">
            <span className="text-muted">{product.category}</span>
          </div>
          <h2 className="fs-6">{product.name}</h2>

          <div className="text-warning mb-1">
            <small>
              {Array.from({ length: Math.round(product.rating) }).map((_, i) => (
                <i key={i} className="bi bi-star-fill" />
              ))}
            </small>{" "}
            <span className="text-muted small">
              {product.rating} ({product.reviews})
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <span className="text-dark">₹{product.price}</span>{" "}
              <span className="text-decoration-line-through text-muted">
                ₹{product.oldPrice}
              </span>
            </div>
            <div>
              <button className="btn btn-primary btn-sm" onClick={handleAddClick}>
                <i className="bi bi-plus-lg"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
