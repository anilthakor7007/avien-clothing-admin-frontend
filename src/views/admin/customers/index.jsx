

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
import Card from "components/card/Card.js";

// Assets
import tableDataTopCreators from "views/admin/brands/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/brands/variables/tableColumnsTopCreators";
import ShowCustomers from "./components/ShowCustomers";


export default function Customers() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
 
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb='20px'
        display={{ base: "block", xl: "grid" }}>
        <Flex
          flexDirection='column'
          borderRadius="20px"
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          <ShowCustomers />
         </Flex>
      </Grid>

    </Box>
  );
}
