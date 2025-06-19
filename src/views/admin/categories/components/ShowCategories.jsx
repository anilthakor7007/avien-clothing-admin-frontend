import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Flex,
  Text,
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
  useToast,
} from "@chakra-ui/react";

// Redux actions
import {
  deleteCategory,
  updateCategory,
  toggleCategoryActive,
  fetchCategories,
} from "../../../../store/categories-slice/categoriesSlice";

// Assets
import banner from "assets/img/nfts/NftBanner1.png"; // Ensure this path is correct

export default function ShowCategories() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { categories, loading } = useSelector((state) => state.categories);

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    description: "",
  });

  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle delete category (with AlertDialog)
  const handleDelete = (id) => {
    setCategoryToDelete(id);
    onOpen();
  };

  // Confirm deletion and delete from backend
  const confirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete))
        .unwrap()
        .then(() => {
          toast({
            title: "Category deleted.",
            description: "The category has been successfully deleted.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to delete category.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
      onClose();
    }
  };

  // Handle input change in the update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for update
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!updatedData.name) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!updatedData.description) {
      toast({
        title: "Validation Error",
        description: "Description is required.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (categoryToUpdate) {
      dispatch(
        updateCategory({
          id: categoryToUpdate._id,
          updatedData: {
            name: updatedData.name,
            description: updatedData.description,
          },
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchCategories()); // Refresh categories
          toast({
            title: "Category updated.",
            description: "The category details have been successfully updated.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to update category.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
      onUpdateClose();
    }
  };

  // Open the update modal with selected category data
  const handleUpdate = (category) => {
    setCategoryToUpdate(category);
    setUpdatedData({
      name: category.name,
      description: category.description,
    });
    onUpdateOpen();
  };

  const toggleActive = (id) => {
    dispatch(toggleCategoryActive(id))
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
      bgImage={`url(${banner})`}
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
        Category collection
      </Text>

      {/* Category list */}
      <Box
        mt="24px"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { width: "12px" },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "6px",
            marginLeft: "2px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "6px",
            border: "3px solid transparent",
          },
          "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
        }}
      >
        {loading ? (
          <Spinner />
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <Flex
              key={category._id}
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
                <Stack ml="20px">
                  <Text fontSize="20px" fontWeight="600">
                    {category.name}
                  </Text>
                  <Text fontSize="12px" color="gray.500">
                    {category.description}
                  </Text>
                  <Badge
                    width="100px"
                    textAlign="center"
                    colorScheme={category.active ? "green" : "red"}
                    cursor="pointer"
                    onClick={() => toggleActive(category._id)}
                  >
                    {category.active ? "Active" : "Inactive"}
                  </Badge>
                </Stack>
              </Flex>
              <Flex>
                <Button onClick={() => handleUpdate(category)} colorScheme="blue" mr="10px">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(category._id)} colorScheme="red">
                  Delete
                </Button>
              </Flex>
            </Flex>
          ))
        ) : (
          <Text color="white">No categories found.</Text>
        )}
      </Box>

      {/* Update Modal */}
      <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleFormSubmit}>
              <FormControl mb="20px" isRequired>
                <FormLabel>Category Name</FormLabel>
                <Input
                  name="name"
                  value={updatedData.name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb="20px" isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={updatedData.description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <ModalFooter>
                <Button type="submit" colorScheme="blue" mr={3}>
                  Update
                </Button>
                <Button onClick={onUpdateClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Alert Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Category
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this category? This action cannot be undone.
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
