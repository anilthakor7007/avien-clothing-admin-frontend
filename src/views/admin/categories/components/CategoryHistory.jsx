import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../../store/categories-slice/categoriesSlice'; // Import your fetchCategories action
import {
  Flex,
  Text,
  Box,
  useColorModeValue,
  Card,
} from "@chakra-ui/react";

export default function CategoryHistory() {
  // Chakra Color Mode
  const textColor = useColorModeValue("brands.900", "white");
  const textColorDate = useColorModeValue("secondaryGray.600", "white");
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories); // Select categories from the Redux state
  const loading = useSelector((state) => state.categories.loading);

  // Fetch category data
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  return (
    <Box
      maxHeight="600px" // Set max height for scroll
      overflowY="auto" // Enable vertical scroll
      p="24px"
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
      {categories.slice().reverse().map((category) => (
        <Card
          key={category._id}
          bg="transparent"
          boxShadow="unset"
          px="24px"
          py="21px"
          mb="20px"
        >
          <Flex direction="column">
            <Text
              color={textColor}
              fontSize="lg"
              mb="5px"
              fontWeight="bold"
            >
              {category.name}
            </Text>
            <Text color={textColorDate} fontSize="sm">
              Description: {category.description}
            </Text>
            <Text color={textColorDate} fontSize="sm">
              Brands: {category.brands.map(brand => brand.name).join(", ")} {/* Assuming brands is an array of objects */}
            </Text>
            <Text color={textColorDate} fontSize="sm">
              Status: {category.active ? "Active" : "Inactive"}
            </Text>
            <Text color={textColorDate} fontSize="sm">
              Last Edited: {new Date(category.updatedAt).toLocaleString()} {/* Adjusting date display */}
            </Text>
          </Flex>
        </Card>
      ))}
    </Box>
  );
}
