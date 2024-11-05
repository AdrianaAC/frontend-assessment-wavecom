import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Products = () => {
  interface Product {
    name: string;
    imgUrl: string;
    desc: string;
    price: number;
    year: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://caa8fd58c97e1e984a88.free.beeceptor.com/api/products/"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Render loading spinner if data is still being fetched
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen p-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center", // Center container on the page
          width: "70%", // Set container to 80% of the screen width
          margin: "0 auto", // Center container horizontally
        }}
      >
        {products.map((product) => (
          <div
            key={product.name}
            style={{
              flex: "1 1 calc(25% - 16px)", // Allows a max of 4 cards per row
              width: "200px", // Limits each card's width for uniformity
              minWidth: "200px",
              height: "300px",
              marginBottom: "16px",
            }}
          >
            <Card style={{ height: "300px" }}>
              <CardMedia
                component="img"
                height="150px" // Set fixed height for image
                image={product.imgUrl}
                alt={product.name}
                style={{
                  width: "150px", // Set fixed width for image
                  height: "150px", // Set fixed height for image
                  objectFit: "contain", // Ensures image fits without cropping
                  margin: "0 auto", // Center-align image in card
                }}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.desc}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Year: {product.year}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
