import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../../store/categories-slice/categoriesSlice'; 
import Card from "components/card/Card.js";

export default function RecentCategories() {
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories); // Select categories from the Redux state
  const loading = useSelector((state) => state.categories.loading);

  // Fetch category data and set the last 3 categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px">
      {categories.slice(-3).map((category) => (
        <CategoryCard key={category._id} category={category} like={like} setLike={setLike} />
      ))}
    </SimpleGrid>
  );
}

// CategoryCard component to handle the expand/collapse logic
function CategoryCard({ category, like, setLike }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");

  // Toggle the expanded state when the "View Full details" button is clicked
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card p="20px" maxW="300px" w="100%">
      <Flex direction={{ base: "column" }} justify="center">
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex justify="space-between" mb="auto">
            <Flex direction="column">
              <Text color={textColor} fontSize="lg" mb="5px" fontWeight="bold" me="14px">
                {category.name}
              </Text>
              <Text color="secondaryGray.600" fontSize="sm" fontWeight="400">
                {category.description}
              </Text>
            </Flex>
          </Flex>

          {isExpanded && (
            <Box mt="10px">
             <Text color={textColor} fontSize="sm" mb="10px">
  Brands: {category.brands.map(brand => brand.name).join(", ")} {/* Assuming each brand object has a 'name' property */}
</Text>

              <Text color={textColor} fontSize="sm">
                Status: {category.active ? "Active" : "Inactive"}
              </Text>
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
