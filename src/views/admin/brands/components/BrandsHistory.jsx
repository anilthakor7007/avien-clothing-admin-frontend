import React, { useState, useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../../../../store/brand-slice/brandsSlice'; 
import axios from "axios";
import {
  Flex,
  Text,
  SimpleGrid,
  Box,
  useColorModeValue,
  Card,
} from "@chakra-ui/react";

export default function BrandsHistory() {
  // Chakra Color Mode
  const textColor = useColorModeValue("brands.900", "white");
  const textColorDate = useColorModeValue("secondaryGray.600", "white");
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.brands.brands); // Select brands from the Redux state
  const loading = useSelector((state) => state.brands.loading);

  // Fetch brand data and set the last 3 brands
  useEffect(() => {
    dispatch(fetchBrands());
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
        /* Scrollbar styles */
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
      {brands.slice().reverse().map((brand) => (
        <Card
          key={brand._id}
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
              {brand.name}
            </Text>
            <Text color={textColorDate} fontSize="sm">
              {brand.tagline}
            </Text>
            <Text color={textColorDate} fontSize="sm">
              Edited: {new Date(brand.updatedAt).toLocaleString()}
            </Text>
            {/* You can include more details about the edit here */}
          </Flex>
        </Card>
      ))}
    </Box>
  );
}
