import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import axios from "axios";
import "./Products.css";

const Products = () => {
  interface Product {
    id: string;
    name: string;
    imgUrl: string;
    desc: string;
    price: number;
    year: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    imgUrl: "",
    desc: "",
    price: 0,
    year: new Date().getFullYear(),
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://ca0352437e66bc41da6a.free.beeceptor.com/api/wavecomProducts/"
        );
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter products based only on the 'name' property
    setFilteredProducts(
      products.filter((product) => product.name.toLowerCase().includes(query))
    );
  };
  // Toggle modal visibility
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null); // Clear error on modal close
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle product deletion
  const handleDelete = async (productId: string) => {
    try {
      // Send DELETE request to the API
      await axios.delete(
        `https://ca0352437e66bc41da6a.free.beeceptor.com/api/wavecomProducts/${productId}`
      );

      // Update the local state to remove the deleted product
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      // Update the filtered products as well
      setFilteredProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSubmit = async () => {
    const isDuplicate = products.some(
      (product) => product.name.toLowerCase() === newProduct.name.toLowerCase()
    );

    if (isDuplicate) {
      setError("A product with this name already exists.");
      return;
    }
    try {
      // POST the new product to the API
      const response = await axios.post(
        "https://ca0352437e66bc41da6a.free.beeceptor.com/api/wavecomProducts/",
        newProduct
      );

      // Add the new product to the list if the POST is successful
      setProducts((prevProducts) => [...prevProducts, response.data]);
      setFilteredProducts((prevProducts) => [...prevProducts, response.data]); // Update filtered list

      // Close the modal
      handleClose();

      // Reset the form
      setNewProduct({
        id: "",
        name: "",
        imgUrl: "",
        desc: "",
        price: 0,
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

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
    <div className="h-screen w-screen p-4 productsPage">
      <Typography
        variant="h4"
        component="h1"
        className="pageTitle"
        gutterBottom
      >
        Products
      </Typography>
      <div className="addContainer" style={{ display: "flex", gap: "16px" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Add Product
        </Button>
        <TextField
          label="Search Products"
          variant="outlined"
          className="searchBar"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
        />
      </div>
      <div className="cardsContainer">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="generalCard">
              <Card className="card" style={{ position: "relative" }}>
                {/* Delete Button at Top-Right */}
                <IconButton
                  aria-label="delete"
                  style={{
                    position: "absolute",
                    top: "8px", // Adjust the top value if necessary
                    right: "8px", // Adjust the right value if necessary
                    color: "#ccc",
                    zIndex: 1,
                  }}
                  onClick={() => handleDelete(product.id)}
                >
                  <Close />
                </IconButton>
                <div className="cardMediaContainer">
                  <CardMedia
                    component="img"
                    image={product.imgUrl}
                    alt={product.name}
                    className="cardMedia"
                  />
                </div>
                <CardContent className="cardContent">
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
          ))
        ) : (
          <p>No products available</p>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="add-product-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              Add New Product
            </Typography>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <TextField
              label="Name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Image URL"
              name="imgUrl"
              value={newProduct.imgUrl}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="desc"
              value={newProduct.desc}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Year"
              name="year"
              type="number"
              value={newProduct.year}
              onChange={handleInputChange}
              fullWidth
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Products;
