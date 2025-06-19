import { 
  Box, 
  Button, 
  Flex, 
  FormControl, 
  FormLabel, 
  Input, 
  Progress, 
  Text, 
  Textarea, 
  useColorModeValue, 
  useToast 
} from '@chakra-ui/react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { addBrand } from '../../../../store/brand-slice/brandsSlice'; 
import axios from 'axios';

export default function AddBrandForm() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const dispatch = useDispatch();
  const toast = useToast();  // Initialize useToast for notifications

  // State for brand form fields
  const [name, setName] = React.useState('');
  const [tagline, setTagline] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState(null); // Image URL from Cloudinary
  const [isUploading, setIsUploading] = React.useState(false);
  const [imageUploading, setImageUploading] = React.useState(false); // Image upload state

  // Function to handle image upload to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'ml_default'); // Add your Cloudinary upload preset here
  
    try {
      setImageUploading(true);
      const response = await axios.post('https://api.cloudinary.com/v1_1/dwu3l0nug/image/upload', formData);
      setImageUploading(false);
      return response.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      setImageUploading(false);
      console.error('Error uploading image:', error);
      toast({
        title: 'Image upload failed',
        description: 'There was an error uploading the image. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return null;
    }
  };

  // Function to validate form fields
  const validateForm = () => {
    if (!name.trim()) {
      toast({
        title: 'Brand Name Required',
        description: 'Please enter a brand name.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return false;
    }
    if (!tagline.trim()) {
      toast({
        title: 'Tagline Required',
        description: 'Please enter a tagline.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return false;
    }
    if (!description.trim()) {
      toast({
        title: 'Description Required',
        description: 'Please enter a description.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return false;
    }
    if (!image) {
      toast({
        title: 'Image Required',
        description: 'Please upload an image.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Validate form fields

    // Construct the new brand object
    const newBrand = {
      name,
      tagline,
      description,
      image,
      active: true, // Default value
    };

    try {
      setIsUploading(true); // Set uploading state
      await dispatch(addBrand(newBrand)); 
      toast({
        title: 'Brand added successfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      // Reset form fields
      setName('');
      setTagline('');
      setDescription('');
      setImage(null);
      document.getElementById('image-input').value = ''; // Clear file input
    } catch (error) {
      console.error('Error adding brand:', error);
      toast({
        title: 'Error adding brand',
        description: 'There was an error adding the brand. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  // Handle image selection and auto-upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Auto-upload image when selected
    const imageUrl = await uploadImageToCloudinary(file);
    if (imageUrl) {
      setImage(imageUrl); // Store the uploaded image URL
      toast({
        title: 'Image uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
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
          Add New Brand
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl mb="4" pt="4" isRequired>
            <FormLabel color={textColor}>Brand Name</FormLabel>
            <Input
              placeholder="Enter brand name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl mb="4" isRequired>
            <FormLabel color={textColorSecondary}>Tagline</FormLabel>
            <Input
              placeholder="Enter tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
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
            <FormLabel color={textColor}>Upload Image</FormLabel>
            <Input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageUploading && <Progress size="xs" isIndeterminate colorScheme="blue" />}
          </FormControl>

          <Flex justify="flex-end" mt="6">
            <Button
              type="button"
              variant="outline"
              mr="4"
              onClick={() => {
                // Reset form
                setName('');
                setTagline('');
                setDescription('');
                setImage(null);
                document.getElementById('image-input').value = ''; // Clear file input
              }}
            >
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue" isLoading={isUploading}>
              Add Brand
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
