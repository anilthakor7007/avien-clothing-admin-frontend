import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../../store/product-slice/productSlice'; // Import your fetchProducts action
import {
  Flex,
  Text,
  Box,
  useColorModeValue,
  Card,
} from "@chakra-ui/react";

export default function ProductHistory() {
  // Chakra Color Mode
  const textColor = useColorModeValue("brands.900", "white");
  const textColorDate = useColorModeValue("secondaryGray.600", "white");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products); // Select products from the Redux state
  const loading = useSelector((state) => state.products.loading);

  // Fetch product data
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  return (
    <Box
      maxHeight="600px" // Set max height for scroll
      overflowY="auto" // Enable vertical scroll
      p="12px"
      css={{
        '&::-webkit-scrollbar': {
          width: '12px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '6px',
          marginLeft: '2px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '6px',
          border: '3px solid #f1f1f1',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}
    >
      {products.slice().reverse().map((product) => (
        <Card
          key={product._id}
          bg="transparent"
          boxShadow="unset"
          px="14px"
          py="11px"
          mb="6px"
        >
          <Flex direction="column">
            <Text
              color={textColor}
              fontSize="lg"
              mb="5px"
              fontWeight="bold"
            >
              {product.name}
            </Text>
            <Text color={textColorDate} fontSize="sm">
              Description: {product.description}
            </Text>
       
            <Text color={textColorDate} fontSize="sm">
              Brand: {product.brand ? product.brand.name : "No brand available"}
            </Text>
            <Text color={textColorDate} fontSize="sm">
              Status: {product.active ? "Active" : "Inactive"}
            </Text>
            <Text color={textColorDate} fontSize="sm">
              Last Edited: {new Date(product.updatedAt).toLocaleString()} {/* Adjusting date display */}
            </Text>
          </Flex>
        </Card>
      ))}
    </Box>
  );
}
