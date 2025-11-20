import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "./ProductItem";

axios.defaults.baseURL = "http://localhost:5000";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data.products || []);
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
