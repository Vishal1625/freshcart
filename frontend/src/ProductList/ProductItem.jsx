import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "./ProductCard";

// ✅ Set correct backend base URL
axios.defaults.baseURL = "http://localhost:5000/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      // ✅ Correct API endpoint
      const res = await axios.get("/products");

      console.log("Products loaded:", res.data);

      // Adjust based on your backend structure
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error("ERROR fetching products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="row">
      {products.map((p) => (
        <div key={p._id} className="col-6 col-md-4 col-lg-3">
          <ProductItem product={p} />
        </div>
      ))}
    </div>
  );
}
