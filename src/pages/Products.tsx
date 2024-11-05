import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress } from "@mui/material";
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
        const response = await axios.get("https://caa8fd58c97e1e984a88.free.beeceptor.com/api/products/");
        setProducts(response.data); // Assuming the response data is an array of products
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen p-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.name}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.imgUrl}
                alt={product.name}
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
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Products;
