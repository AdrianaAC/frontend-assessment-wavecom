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
  // Define Product interface for type safety across product-related data
  interface Product {
    id: string;
    name: string;
    imgUrl: string;
    desc: string;
    price: number;
    year: number;
  }

  // State hooks to manage product data, UI states, and form data
  const [products, setProducts] = useState<Product[]>([]); // Complete product list from API
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Filtered product list based on search
  const [loading, setLoading] = useState(true); // Loading state for API fetch operation
  const [open, setOpen] = useState(false); // Modal visibility state
  const [error, setError] = useState<string | null>(null); // Error message state for validation errors
  const [newProduct, setNewProduct] = useState<Product>({
    // State for new product form data
    id: "",
    name: "",
    imgUrl: "",
    desc: "",
    price: 0,
    year: new Date().getFullYear(),
  });
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Fetch products from the API on initial load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://ca0352437e66bc41da6a.free.beeceptor.com/api/wavecomProducts/"
        );
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products to the full list
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    fetchProducts();
  }, []);

  // Handle search input changes and filter products based on query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter products based only on the 'name' property
    setFilteredProducts(
      products.filter((product) => product.name.toLowerCase().includes(query))
    );
  };

  // Open modal to add new product
  const handleOpen = () => setOpen(true);

  // Close modal and reset form fields and error state
  const handleClose = () => {
    setOpen(false);
    setError(null); // Clear error on modal close

    // Reset the form fields to initial values
    setNewProduct({
      id: "",
      name: "",
      imgUrl: "",
      desc: "",
      price: 0,
      year: new Date().getFullYear(),
    });
  };

  // Handle input changes in the add product form and update newProduct state accordingly
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle deletion of a product by sending a DELETE request to the API
  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(
        `https://ca0352437e66bc41da6a.free.beeceptor.com/api/wavecomProducts/${productId}`
      );

      // Update local product and filtered product lists after deletion
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      setFilteredProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle submission of the new product form
  const handleSubmit = async () => {
    // Check for duplicate product name to avoid adding a product with the same name
    const isDuplicate = products.some(
      (product) => product.name.toLowerCase() === newProduct.name.toLowerCase()
    );

    if (isDuplicate) {
      setError("A product with this name already exists.");
      return;
    }

    try {
      // POST the new product to the API and update product lists on success
      const response = await axios.post(
        "https://ca0352437e66bc41da6a.free.beeceptor.com/api/wavecomProducts/",
        newProduct
      );

      setProducts((prevProducts) => [...prevProducts, response.data]);
      setFilteredProducts((prevProducts) => [...prevProducts, response.data]); // Update filtered list

      // Close the modal and reset the form
      handleClose();
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
          className="searchBar"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
        />
      </div>
      <div className="cardsContainer">
        {/* Conditional rendering of products or a message when no products are available */}
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="generalCard">
              <Card className="card" style={{ position: "relative" }}>
                {/* Delete Button positioned at the top-right corner of the card */}
                <IconButton
                  aria-label="delete"
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
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

        {/* Modal for adding a new product */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="add-product-modal"
        >
          <Box className="box">
            <Typography variant="h6" component="h2" className="addTitle">
              Add New Product
            </Typography>
            {/* Display error message if duplicate product name exists */}
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            {/* Form fields for new product */}
            <TextField
              label="Name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              style={{
                margin: 10,
                borderRadius: 10,
                border: "2px solid #3339ff",
              }}
            />
            <TextField
              label="Image URL"
              name="imgUrl"
              value={newProduct.imgUrl}
              onChange={handleInputChange}
              style={{
                margin: 10,
                borderRadius: 10,
                border: "2px solid #3339ff",
              }}
            />
            <TextField
              label="Description"
              name="desc"
              value={newProduct.desc}
              onChange={handleInputChange}
              style={{
                margin: 10,
                borderRadius: 10,
                border: "2px solid #3339ff",
              }}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleInputChange}
              style={{
                margin: 10,
                borderRadius: 10,
                border: "2px solid #3339ff",
              }}
            />
            <TextField
              label="Year"
              name="year"
              type="number"
              value={newProduct.year}
              onChange={handleInputChange}
              style={{
                margin: 10,
                borderRadius: 10,
                border: "2px solid #3339ff",
              }}
            />
            {/* Form buttons for canceling or submitting the form */}
            <Box
              display="flex"
              justifyContent="space-around"
              style={{ padding: 10 }}
              mt={2}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                className="buttonForm"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className="buttonForm"
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
