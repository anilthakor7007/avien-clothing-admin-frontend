import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentBrands } from '../../../../store/brand-slice/brandsSlice'; 
import Card from "components/card/Card.js";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

export default function RecentBrands() {
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.brands.brands); // Select brands from the Redux state
  const loading = useSelector((state) => state.brands.loading);

  // Fetch brand data and set the last 3 brands
  useEffect(() => {
    dispatch(fetchRecentBrands());
  }, [dispatch]);

  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px">
      {brands.slice(-3).map((brand) => (
        <BrandCard key={brand._id} brand={brand} like={like} setLike={setLike} />
      ))}
    </SimpleGrid>
  );
}

// BrandCard component to handle the expand/collapse logic
function BrandCard({ brand, like, setLike }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");

  // Toggle the expanded state when the "View Full details" button is clicked
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card p="20px" maxW="300px" w="100%">
      <Flex direction={{ base: "column" }} justify="center">
        <Box mb={{ base: "20px", "2xl": "20px" }} position="relative">
          <Image
            src={brand.image}
            w="100%"
            h="100%"
            borderRadius="20px"
          />
         
                 </Box>
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex justify="space-between" mb="auto">
            <Flex direction="column">
              <Text color={textColor} fontSize="lg" mb="5px" fontWeight="bold" me="14px">
                {brand.name}
              </Text>
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="400">
                {brand.tagline}
              </Text>
            </Flex>
          </Flex>

          {isExpanded && (
            <Box mt="10px">
              <Text color={textColor} fontSize="sm" mb="10px">
                {brand.description}
              </Text>
              <Text color={textColor} fontSize="sm">
                Status: {brand.active ? "Active" : "Inactive"}
              </Text>
            </Box>
          )}

          <Flex align="start" justify="space-between" mt="25px">
            <Link>
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
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
