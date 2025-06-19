import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Button,
  Flex,
  Text,
  Image,
  Box,
  Stack,
  Badge,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Spinner,
  useToast, // Import Chakra UI toast
} from "@chakra-ui/react";

// Import the Redux actions
import {
  fetchBrands,
  deleteBrand,
  updateBrand,
  toggleBrandActive,
} from "../../../../store/brand-slice/brandsSlice"; // Adjust the import path accordingly

// Assets
import banner from "assets/img/nfts/NftBanner1.png";

export default function ShowBrands() {
  const dispatch = useDispatch();
  const toast = useToast(); // Initialize toast for notifications
  const { brands, loading } = useSelector((state) => state.brands);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [brandToUpdate, setBrandToUpdate] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    tagline: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cancelRef = useRef();

  // Chakra modal management
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  // Fetch brands from Redux on component mount
  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  // Handle delete brand (with AlertDialog)
  const handleDelete = (id) => {
    setBrandToDelete(id);
    onOpen(); // Open the confirmation dialog
  };

  // Confirm deletion and delete from backend
  const confirmDelete = () => {
    if (brandToDelete) {
      dispatch(deleteBrand(brandToDelete));
      toast({
        title: "Brand deleted.",
        description: "The brand has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  // Handle input change in update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file change for image selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Upload image to Cloudinary and return the image URL
  const uploadImageToCloudinary = async () => {
    if (!imageFile) return updatedData.image; // Return old image if no new image is uploaded

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset

    try {
      setUploading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dwu3l0nug/image/upload",
        formData
      );
      setUploading(false);
      return response.data.secure_url;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle form submission for update with validation
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!updatedData.name || !updatedData.tagline || !updatedData.description) {
      toast({
        title: "Validation Error.",
        description: "All fields must be filled in.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    let imageUrl = updatedData.image;

    // If a new image is selected, upload it to Cloudinary
    if (imageFile) {
      const uploadedImageUrl = await uploadImageToCloudinary();
      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
      } else {
        console.error("Failed to upload image.");
        return;
      }
    }

    const updatedBrandData = {
      ...updatedData,
      image: imageUrl,
    };

    if (brandToUpdate) {
      dispatch(
        updateBrand({ id: brandToUpdate._id, updatedData: updatedBrandData })
      );
      toast({
        title: "Brand updated.",
        description: "The brand details have been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset image file after updating
      setImageFile(null);

      onUpdateClose();
    }
  };

  // Open the update modal with selected brand data
  const handleUpdate = (brand) => {
    setBrandToUpdate(brand);
    setUpdatedData({
      name: brand.name,
      tagline: brand.tagline,
      description: brand.description,
      image: brand.image,
    });

    // Reset image file when opening the modal for a new brand
    setImageFile(null);
    onUpdateOpen();
  };

  const toggleActive = (id) => {
    dispatch(toggleBrandActive(id))
      .unwrap()
      .then(() => {
        toast({
          title: "Category status updated.",
          description: "The category status has been successfully updated.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to update category status.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };
  
  
  

  return (
    <Flex
      direction="column"
      bgImage={banner}
      bgSize="cover"
      py={{ base: "20px", md: "26px" }}
      px={{ base: "20px", md: "44px" }}
      borderRadius="30px"
      height="620px"
    >
      <Text
        fontSize={{ base: "24px", md: "34px" }}
        color="white"
        mb="14px"
        fontWeight="700"
        lineHeight={{ base: "32px", md: "42px" }}
      >
        Your Brand Details
      </Text>

      {/* Brand list */}
      <Box mt="24px" overflowY="auto" css={{
        /* Scrollbar styles */
        '&::-webkit-scrollbar': { width: '12px' },
        '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '6px', marginLeft: '2px' },
        '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '6px', border: '3px solid transparent' },
        '&::-webkit-scrollbar-thumb:hover': { background: '#555' },
      }}>
        {loading ? (
          <Spinner />
        ) : brands.length > 0 ? (
          brands.map((brand) => (
            <Flex
              key={brand._id}
              direction="row"
              bg="white"
              borderRadius="20px"
              p="20px"
              mb="16px"
              boxShadow="0 1px 5px rgba(0,0,0,0.1)"
              justify="space-between"
              align="center"
            >
              <Flex align="center">
                <Image
                  src={brand.image}
                  borderRadius="12px"
                  boxSize="120px"
                  objectFit="cover"
                  alt={brand.name}
                />
                <Stack ml="20px">
                  <Text fontSize="20px" fontWeight="600">
                    {brand.name}
                  </Text>
                  <Text fontSize="14px">{brand.tagline}</Text>
                  <Text fontSize="12px" color="gray.500">
                    {brand.description}
                  </Text>
                  <Badge
                    width="100px"
                    textAlign="center"
                    colorScheme={brand.active ? "green" : "red"}
                    cursor="pointer"
                    onClick={() => toggleActive(brand._id, brand.active)}
                  >
                    {brand.active ? "Active" : "Inactive"}
                  </Badge>
                </Stack>
              </Flex>
              <Flex>
                <Button
                  onClick={() => handleUpdate(brand)}
                  colorScheme="blue"
                  mr="10px"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(brand._id)}
                  colorScheme="red"
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
          ))
        ) : (
          <Text color="white">No brands found.</Text>
        )}
      </Box>

      {/* Update Modal */}
      <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Brand</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleFormSubmit}>
            <ModalBody>
              <FormControl mb="4">
                <FormLabel>Brand Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={updatedData.name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Tagline</FormLabel>
                <Input
                  type="text"
                  name="tagline"
                  value={updatedData.tagline}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={updatedData.description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Brand Image</FormLabel>
                <Input type="file" onChange={handleFileChange} />
                {updatedData.image && !imageFile && (
                  <Image
                    src={updatedData.image}
                    alt="Brand"
                    mt="2"
                    boxSize="150px"
                    objectFit="cover"
                  />
                )}
                {imageFile && (
                  <Image
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    mt="2"
                    boxSize="150px"
                    objectFit="cover"
                  />
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                {uploading ? <Spinner size="sm" /> : "Save"}
              </Button>
              <Button variant="ghost" onClick={onUpdateClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Brand
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
