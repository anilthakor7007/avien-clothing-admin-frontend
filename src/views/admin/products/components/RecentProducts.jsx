import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useColorModeValue,
  SimpleGrid,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../../store/product-slice/productSlice'; // Ensure the path is correct
import Card from "components/card/Card.js";
import { column } from "stylis";

export default function RecentProducts() {
  const textColor = useColorModeValue("navy.700", "white");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products); // Select products from the Redux state
  const loading = useSelector((state) => state.products.loading);

  // Fetch product data and set the last 3 products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  // Log products for debugging
  console.log("Fetched Products:", products);

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px">
      {products.slice(-3).map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </SimpleGrid>
  );
}

// ProductCard component to handle the expand/collapse logic
function ProductCard({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");

  // Toggle the expanded state when the "View Full details" button is clicked
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    console.log(`Toggled expand for ${product.name}: ${!isExpanded}`);
  };

  return (
    <Card p="20px" maxW="300px" w="100%">
      <Flex direction={{ base: "column" }} justify="center">
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex justify="space-between" mb="auto">
            <Flex direction="column">
              <Text color={textColor} fontSize="lg" mb="5px" fontWeight="bold" me="14px">
                {product.name}
              </Text>
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="400">
                {product.description}
              </Text>
              
            </Flex>
          </Flex>

          {isExpanded && (
            <Box mt="10px">
              <Text color={textColor} fontSize="sm" mb="10px">
                Brand: {product.brand ? product.brand.name : "No brand available"}
              </Text>
              <Text color={textColor} fontSize="sm" mb="10px">
                Sizes & Prices:
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map(size => (
                    <Text key={size._id}>
                      {size.size}: {size.price} Rs.
                    </Text>
                  ))
                ) : (
                  <Text>No sizes available</Text>
                )}
              </Text>
              <Text color={textColor} fontSize="sm" mb="10px">
                Status: {product.active ? "Active" : "Inactive"}
              </Text>
              <Text color={textColor} fontSize="sm" mb="10px">
                Product Images:
              </Text>
              <Button onClick={() => setIsModalOpen(true)} colorScheme="blue">
                Show Images
              </Button>

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl" >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Product Images</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody >
                    <Stack spacing={4} direction={column} >
                      {product.images && product.images.length > 0 ? (
                        product.images.map(image => (
                          <Image key={image.url} height="200px" width="200px" src={image.url} alt="Product Image" borderRadius="8px" />
                        ))
                      ) : (
                        <Text>No images available</Text>
                      )}
                    </Stack>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          )}

          <Flex align="start" justify="space-between" mt="25px">
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              onClick={toggleExpand}
            >
              {isExpanded ? "Show Less" : "View Full details"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
