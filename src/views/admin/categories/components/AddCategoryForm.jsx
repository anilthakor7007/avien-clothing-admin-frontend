import { 
  Box, 
  Button, 
  Flex, 
  FormControl, 
  FormLabel, 
  Input, 
  Text, 
  Textarea, 
  useColorModeValue, 
  useToast, 
  CheckboxGroup, 
  Checkbox 
} from '@chakra-ui/react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory } from '../../../../store/categories-slice/categoriesSlice'; 
import { fetchBrands } from '../../../../store/brand-slice/brandsSlice'; 

export default function AddCategoryForm() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const dispatch = useDispatch();
  const toast = useToast();

  // State for category form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Fetch brands from Redux store
  const { brands } = useSelector((state) => state.brands);

  useEffect(() => {
    // Fetch brands on component mount
    dispatch(fetchBrands());
  }, [dispatch]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!name.trim()) {
      toast({
        title: 'Category Name is required',
        description: 'Please enter a category name.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: 'Description is required',
        description: 'Please enter a description for the category.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (selectedBrands.length === 0) {
      toast({
        title: 'No Brands Selected',
        description: 'Please select at least one brand for this category.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Construct the new category object
    const newCategory = {
      name,
      description,
      brands: selectedBrands, // Only the selected brands will be added
      active: true, // Default value
    };

    try {
      await dispatch(addCategory(newCategory)); 
      toast({
        title: 'Category added successfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      // Reset form fields
      setName('');
      setDescription('');
      setSelectedBrands([]);
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error adding category',
        description: 'There was an error adding the category. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Handle brands selection change
  const handleBrandsChange = (value) => {
    setSelectedBrands(value);
  };

  return (
    <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow="xl"
        p="6"
        py="4"
        rounded="md"
        w="100%"
      >
        <Text color={textColor} fontSize="2xl" fontWeight="600">
          Add New Category
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl mb="4" pt="4" isRequired>
            <FormLabel color={textColor}>Category Name</FormLabel>
            <Input
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl mb="4" isRequired>
            <FormLabel color={textColorSecondary}>Description</FormLabel>
            <Textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl mb="4" >
            <FormLabel color={textColor}>Select Brands</FormLabel>
            <Text fontSize="sm" color={textColorSecondary}>
              Please select one or more brands to include in this category.
            </Text>
            <CheckboxGroup value={selectedBrands} onChange={handleBrandsChange}>
              <Flex direction="column">
                {brands.map((brand) => (
                  <Checkbox key={brand._id} value={brand._id} mb={2}>
                    {brand.name}
                  </Checkbox>
                ))}
              </Flex>
            </CheckboxGroup>
          </FormControl>

          <Flex justify="flex-end" mt="6">
            <Button
              type="button"
              variant="outline"
              mr="4"
              onClick={() => {
                // Reset form
                setName('');
                setDescription('');
                setSelectedBrands([]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Add Category
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
