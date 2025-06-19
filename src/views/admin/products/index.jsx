

import React from "react";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";

// Custom components
import ShowBrands from "views/admin/brands/components/ShowBrands";
import AddBrandsForm from "views/admin/categories/components/AddCategoryForm";
import BrandsHistory from "views/admin/categories/components/CategoryHistory";
// import RecentBrands from "views/admin/categories/components/RecentProducts";
import Card from "components/card/Card.js";

// Assets
import tableDataTopCreators from "views/admin/brands/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/brands/variables/tableColumnsTopCreators";

import RecentProducts from "./components/RecentProducts";
// import AddProductForm from "./components/AddProductForm";
import ProductHistory from "./components/ProductHistory";
import ShowProducts from "./components/ShowProducts";
import AddProductForm from "./components/AddProductForm";

export default function Products() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
 
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb='20px'
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}>
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          <ShowProducts/>
          <Flex direction='column'>
            <Flex
              mt='45px'
              mb='20px'
              justifyContent='space-between'
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}>
              <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
                Recently Added Products
              </Text>
             
            </Flex>
           
              <RecentProducts/>

          </Flex>
        </Flex>
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}>
          <Card px='0px' mb='20px'>
            <AddProductForm
              tableData={tableDataTopCreators}
              columnsData={tableColumnsTopCreators}
            />
          </Card>
          <Card p='0px'>
            <Flex
              align={{ sm: "flex-start", lg: "center" }}
              justify='space-between'
              w='100%'
              px='22px'
              py='10px'>
              <Text color={textColor} fontSize='xl' fontWeight='600'>
                Recent History
              </Text>
              </Flex>     
           <ProductHistory/>       
          </Card>
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
