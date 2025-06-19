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
  Checkbox,
  Select,
  NumberInput,
  NumberInputField,
  Image,
  Grid,
  Spinner,
} from '@chakra-ui/react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../../../../store/brand-slice/brandsSlice';
import { createProduct } from '../../../../store/product-slice/productSlice';

export default function AddProductForm() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const dispatch = useDispatch();
  const toast = useToast();

  // State for form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [sizes, setSizes] = useState([]);
  const [prices, setPrices] = useState({});
  const [discount, setDiscount] = useState(0);
  const [images, setImages] = useState([]); // URLs to be uploaded
  const [imagePreviews, setImagePreviews] = useState([]); // Local preview URLs
  const [brand, setBrand] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  const { brands } = useSelector((state) => state.brands);

  useEffect(() => {
    console.log("Fetching brands...");
    dispatch(fetchBrands());
  }, [dispatch]);

  // Handle image upload and preview generation
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files: ", files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    console.log("Image previews: ", previews);
    setImagePreviews((prev) => [...prev, ...previews]);

    setLoading(true); // Set loading to true

    try {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const response = await uploadImageToCloudinary(file);
          return {
            url: response.secure_url,
            public_id: response.public_id,
          };
        })
      );

      console.log("All uploaded image URLs: ", imageUrls);
      setImages((prev) => [...prev, ...imageUrls]);
    } catch (error) {
      console.error("Error uploading images: ", error);
      toast({
        title: 'Error uploading images',
        description: 'There was an error uploading the images. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default"); // replace with your Cloudinary preset
    formData.append("cloud_name", "dwu3l0nug"); // replace with your Cloudinary cloud name

    const response = await fetch("https://api.cloudinary.com/v1_1/dwu3l0nug/image/upload", {
      method: "POST",
      body: formData,
    });

    return await response.json(); // return the full response
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with values: ", {
      name,
      description,
      details,
      sizes,
      images,
      brand,
      discount,
    });

    if (!name || !description || !details || !brand || sizes.length === 0 || images.length === 0) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all the required fields.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const sizePrices = sizes.map((size) => ({
      size,
      price: prices[size] || 0,
    }));

    const newProduct = {
      name,
      description,
      details,
      sizes: sizePrices,
      discount,
      images,
      brand,
      active: true,
    };

    try {
      console.log("Dispatching createProduct with newProduct: ", newProduct);
      await dispatch(createProduct(newProduct)); // Ensure you await this
      toast({
        title: 'Product added successfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      // Reset form fields
      setName('');
      setDescription('');
      setDetails('');
      setSizes([]);
      setPrices({});
      setDiscount(0);
      setImages([]);
      setImagePreviews([]);
      setBrand('');
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error adding product',
        description: 'There was an error adding the product. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleSizesChange = (value) => {
    setSizes(value);
    console.log("Selected sizes: ", value);
  };

  const handlePriceChange = (size, value) => {
    console.log(`Price for size ${size} changed to: `, value);
    setPrices((prev) => ({
      ...prev,
      [size]: Number(value),
    }));
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
          Add New Product
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl mb="4" pt="4" isRequired>
            <FormLabel color={textColor}>Product Name</FormLabel>
            <Input
              placeholder="Enter product name"
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

          <FormControl mb="4" isRequired>
            <FormLabel color={textColor}>Details</FormLabel>
            <Textarea
              placeholder="Enter product details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </FormControl>

          <FormControl mb="4" isRequired>
            <FormLabel color={textColor}>Select Brand</FormLabel>
            <Select
              placeholder="Select brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              {brands?.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              )) || <option>No brands available</option>}
            </Select>
          </FormControl>

          <FormControl mb="4">
            <FormLabel color={textColor}>Select Sizes and Prices</FormLabel>
            <CheckboxGroup value={sizes} onChange={handleSizesChange}>
              <Flex direction="column">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <Flex key={size} align="center" mb="2">
                    <Checkbox value={size} mr="4">
                      {size}
                    </Checkbox>
                    <NumberInput
                      placeholder={`Price for ${size}`}
                      value={prices[size] || ''}
                      onChange={(value) => handlePriceChange(size, value)}
                      min={0}
                      width="150px"
                    >
                      <NumberInputField />
                    </NumberInput>
                  </Flex>
                ))}
              </Flex>
            </CheckboxGroup>
          </FormControl>

          <FormControl mb="4">
            <FormLabel color={textColor}>Discount (%)</FormLabel>
            <NumberInput
              placeholder="Enter discount percentage"
              value={discount}
              onChange={(value) => setDiscount(Number(value))}
              min={0}
              max={100}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl mb="4" isRequired>
            <FormLabel color={textColor}>Upload Images</FormLabel>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </FormControl>

          {/* Preview Images */}
          <Grid templateColumns="repeat(3, 1fr)" gap={4} mb="4">
            {imagePreviews.map((preview, index) => (
              <Box key={index}>
                <Image src={preview} alt={`Preview ${index}`} boxSize="150px" objectFit="cover" />
              </Box>
            ))}
          </Grid>

          {/* Loader */}
          {loading && (
            <Flex justifyContent="center" mb="4">
              <Spinner size="lg" />
            </Flex>
          )}

          <Button
            type="submit"
            colorScheme="teal"
            isFullWidth
            mb="4"
            isLoading={loading} // Disable button during loading
          >
            Add Product
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
