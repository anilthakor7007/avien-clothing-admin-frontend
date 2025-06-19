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
  RadioGroup,
  Radio,
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
  useToast,
} from "@chakra-ui/react";

// Import the Redux actions
import {
  fetchProducts,
  deleteProduct,
  updateProduct,
  toggleProductActive,
} from "../../../../store/product-slice/productSlice"; // Adjust the import path accordingly

// Assets
import banner from "assets/img/nfts/NftBanner1.png";

export default function ShowProducts() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { products = [], loading } = useSelector((state) => state.products);
  const { brands: availableBrands = [] } = useSelector((state) => state.brands);
  
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    brand: "",
    sizes: [{ size: "", price: "" }],
    description: "",
    discount: "",
    images: [],
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [productDetails, setProductDetails] = useState(null); // State for product details
  const cancelRef = useRef();

  // Chakra modal management
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onClose: onImageModalClose,
  } = useDisclosure();
  const {
    isOpen: isDetailsModalOpen,
    onOpen: onDetailsModalOpen,
    onClose: onDetailsModalClose,
  } = useDisclosure(); // Modal for product details

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle delete product (with AlertDialog)
  const handleDelete = (id) => {
    setProductToDelete(id);
    onOpen(); // Open the confirmation dialog
  };

  // Confirm deletion and delete from backend
  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete));
      toast({
        title: "Product deleted.",
        description: "The product has been successfully deleted.",
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

  // Handle size and price changes
  const handleSizeChange = (index, e) => {
    const { name, value } = e.target;
    const newSizes = [...updatedData.sizes];
    newSizes[index][name] = value;
    setUpdatedData({ ...updatedData, sizes: newSizes });
  };

  // Add a new size field
  const addSizeField = () => {
    setUpdatedData((prevData) => ({
      ...prevData,
      sizes: [...prevData.sizes, { size: "", price: "" }],
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Upload image to Cloudinary and return the image URL
  const uploadImageToCloudinary = async (file) => {
    if (!file) return; // Return if no file

    const formData = new FormData();
    formData.append("file", file);
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

  // Handle form submission for update
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let images = await Promise.all(
      updatedData.images.map((img) => uploadImageToCloudinary(img.file))
    );

    const updatedProductData = {
      ...updatedData,
      images: images.filter((img) => img), // Filter out any null images
    };

    if (productToUpdate) {
      dispatch(
        updateProduct({ id: productToUpdate._id, productData: updatedProductData })
      );

      toast({
        title: "Product updated.",
        description: "The product details have been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset image file after updating
      setImageFile(null);
      onUpdateClose();
    }
  };

  // Open the update modal with selected product data
  const handleUpdate = (product) => {
    setProductToUpdate(product);
    setUpdatedData({
      name: product.name,
      brand: product.brand ? product.brand._id : "", // Ensure brand ID is set safely
      sizes: product.sizes.map(size => ({ size: size.size, price: size.price })),
      description: product.description,
      discount: product.discount || "", // Initialize discount
      images: product.images.map((imgUrl) => ({ url: imgUrl, file: null })), // Initialize images
    });
    setImageFile(null);
    onUpdateOpen();
  };

  const toggleActive = (id) => {
    dispatch(toggleProductActive(id))
      .unwrap()
      .then(() => {
        toast({
          title: "Product status updated.",
          description: "The product status has been successfully updated.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to update product status.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  // Function to delete an image
  const deleteImage = (index) => {
    const updatedImages = [...updatedData.images];
    updatedImages.splice(index, 1);
    setUpdatedData({ ...updatedData, images: updatedImages });
  };

  // Function to add a new image
  const addNewImage = async () => {
    if (!imageFile) return;

    const imageUrl = await uploadImageToCloudinary(imageFile);
    if (imageUrl) {
      setUpdatedData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: imageUrl, file: null }],
      }));
      setImageFile(null); // Clear the file input after upload
    }
  };

  // Function to open the details modal
  const showProductDetails = (product) => {
    setProductDetails(product);
    onDetailsModalOpen();
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
      width="100%"
      maxWidth="100%" 
      position="relative"
    >
      <Text
        fontSize={{ base: "24px", md: "34px" }}
        color="white"
        mb="14px"
        fontWeight="700"
        lineHeight={{ base: "32px", md: "42px" }}
      >
        Product Collections
      </Text>

      {/* Product list */}
      <Box
        mt="24px"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { width: '12px' },
          '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '6px', marginLeft: '2px' },
          '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '6px', border: '3px solid transparent' },
          '&::-webkit-scrollbar-thumb:hover': { background: '#555' },
        }}
      >
        {loading ? (
          <Spinner />
        ) : products.length > 0 ? (
          products.map((product) => (
            <Flex
              key={product._id}
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
                  src={product.images[0]?.url || "fallback-image-url"} // Use fallback if no images
                  borderRadius="12px"
                  boxSize="120px"
                  objectFit="cover"
                  alt={product.name}
                />
                <Stack ml="20px">
                  <Text fontSize="20px" fontWeight="600" color="black">
                    {product.name}
                  </Text>
                  <Text fontSize="12px" color="gray.500">
                    {product.description}
                  </Text>
                  <Text fontSize="sm" mb="10px">
                    Brand: {product.brand ? product.brand.name : "No brand available"}
                  </Text>
                  <Text fontSize="14px" color="green.500">
                    Prices:
                  </Text>
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size) => (
                      <Text key={size._id}>
                        {size.size}: {size.price} Rs.
                      </Text>
                    ))
                  ) : (
                    <Text>No sizes available.</Text>
                  )}
                  {product.discount && (
                    <Text fontSize="14px" color="red.500">
                      Discount: {product.discount}%
                    </Text>
                  )}
                  <Badge
                    width="100px"
                    textAlign="center"
                    colorScheme={product.active ? "green" : "red"}
                    cursor="pointer"
                    onClick={() => toggleActive(product._id)}
                  >
                    {product.active ? "Active" : "Inactive"}
                  </Badge>
                </Stack>
              </Flex>
              <Stack direction="column">
                <Button colorScheme="blue" onClick={() => handleUpdate(product)}>
                  Edit
                </Button>
                <Button colorScheme="red" onClick={() => handleDelete(product._id)}>
                  Delete
                </Button>
                <Button colorScheme="teal" onClick={() => showProductDetails(product)}>
                  See All Details
                </Button>
                <Button colorScheme="teal" onClick={onImageModalOpen}>
                  Manage Images
                </Button>
              </Stack>
            </Flex>
          ))
        ) : (
          <Text color="white">No products found.</Text>
        )}
      </Box>

      {/* Alert Dialog for delete confirmation */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot be undone.
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

      {/* Modal for updating product */}
      <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name" mb="4">
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={updatedData.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb="20px">
              <FormLabel>Brands</FormLabel>
              <RadioGroup
                value={updatedData.brand}
                onChange={(value) => setUpdatedData({ ...updatedData, brand: value })}
              >
                <Stack direction="column">
                  {availableBrands && availableBrands.map((brand) => (
                    <Radio key={brand._id} value={brand._id}>
                      {brand.name}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>
            {updatedData.sizes.map((size, index) => (
              <Flex key={index} mb="4">
                <FormControl id={`size-${index}`} mb="4" mr="4">
                  <FormLabel>Size</FormLabel>
                  <Input
                    name="size"
                    value={size.size}
                    onChange={(e) => handleSizeChange(index, e)}
                  />
                </FormControl>
                <FormControl id={`price-${index}`} mb="4">
                  <FormLabel>Price</FormLabel>
                  <Input
                    name="price"
                    type="number"
                    value={size.price}
                    onChange={(e) => handleSizeChange(index, e)}
                  />
                </FormControl>
              </Flex>
            ))}
            <Button onClick={addSizeField} mb="4">Add Size</Button>
            <FormControl id="description" mb="4">
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={updatedData.description}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="discount" mb="4">
              <FormLabel>Discount</FormLabel>
              <Input
                name="discount"
                type="number"
                value={updatedData.discount}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleFormSubmit}>
              Update
            </Button>
            <Button variant="ghost" onClick={onUpdateClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for managing product images */}
      <Modal isOpen={isImageModalOpen} onClose={onImageModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Product Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {updatedData.images.map((img, index) => (
                <Flex key={index} justify="space-between" align="center">
                  <Image src={img.url} boxSize="50px" objectFit="cover" alt={`Image ${index + 1}`} />
                  <Button colorScheme="red" onClick={() => deleteImage(index)}>
                    Delete
                  </Button>
                </Flex>
              ))}
              <FormControl>
                <FormLabel>Add New Image</FormLabel>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                <Button onClick={addNewImage} mt="2">Upload</Button>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onImageModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for displaying product details */}
      <Modal isOpen={isDetailsModalOpen} onClose={onDetailsModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {productDetails && (
              <Stack spacing={4} >
                <Text fontSize="20px" fontWeight="600">{productDetails.name}</Text>
                <Text fontSize="14px">Description: {productDetails.description}</Text>
                <Text fontSize="14px">Details: {productDetails.details}</Text>
                <Text fontSize="14px">Brand: {productDetails.brand ? productDetails.brand.name : "No brand available"}</Text>
                <Text fontSize="14px">Discount: {productDetails.discount || "No discount"}%</Text>
                <Text fontSize="14px">Prices:</Text>
                {productDetails.sizes.map((size) => (
                  <Text key={size._id}>{size.size}: {size.price} Rs.</Text>
                ))}
                
                <Text fontSize="14px">Images:</Text>
                <Flex>
                  {productDetails.images.map((image, index) => (
                    <Image key={index} src={image.url} boxSize="100px" objectFit="cover" alt={`Image ${index + 1}`} />
                  ))}
                </Flex>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDetailsModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
