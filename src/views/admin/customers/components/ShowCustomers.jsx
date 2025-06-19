'use client';
/* eslint-disable */

import {
  Box,
  Button,
  Card,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCustomers } from '../../../../store/customer-slice/customerSlice';
// import { useDispatch } from 'react-redux';
import { registerCustomer } from '../../../../store/customer-slice/customerSlice';
// import { useToast } from '@chakra-ui/react'; 

const columnHelper = createColumnHelper();

export default function ShowCustomers() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.customers);
  const [data, setData] = React.useState(customers);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();


  // New Customer State
  const [newCustomer, setNewCustomer] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthdate: '',
    gender: '',
    phoneNumber: '',
  });

  // Error State
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  // Search State
  const [searchTerm, setSearchTerm] = React.useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;

  React.useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  React.useEffect(() => {
    setData(customers);
  }, [customers]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const columns = [
    columnHelper.accessor('firstName', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          FIRST NAME
        </Text>
      ),
      cell: (info) => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('lastName', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          LAST NAME
        </Text>
      ),
      cell: (info) => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('email', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          EMAIL
        </Text>
      ),
      cell: (info) => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('phoneNumber', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          PHONE
        </Text>
      ),
      cell: (info) => info.getValue() || 'N/A',
    }),
    columnHelper.accessor('createdAt', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          REGISTERED
        </Text>
      ),
      cell: (info) => new Date(info.getValue()).toLocaleString() || 'N/A',
    }),
    columnHelper.accessor('gender', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          GENDER
        </Text>
      ),
      cell: (info) => info.getValue() || 'N/A',
    }),
  ];

  const [sorting, setSorting] = React.useState([]);

  const sortedData = React.useMemo(() => {
    const sorted = [...data];
    if (sorting.length) {
      sorted.sort((a, b) => {
        for (const { id, desc } of sorting) {
          if (a[id] < b[id]) return desc ? 1 : -1;
          if (a[id] > b[id]) return desc ? -1 : 1;
        }
        return 0;
      });
    }
    return sorted;
  }, [data, sorting]);

  const filteredData = React.useMemo(() => {
    return sortedData.filter((customer) =>
      Object.values(customer).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  const paginatedData = React.useMemo(() => {
    const start = currentPage * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const validateCustomer = () => {
    const newErrors = {};
    if (!newCustomer.firstName) newErrors.firstName = 'First Name is required.';
    if (!newCustomer.lastName) newErrors.lastName = 'Last Name is required.';
    if (!newCustomer.email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newCustomer.email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!newCustomer.password) {
      newErrors.password = 'Password is required.';
    } else if (newCustomer.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    if (!newCustomer.birthdate) newErrors.birthdate = 'Birthdate is required.';
    if (!newCustomer.gender) newErrors.gender = 'Gender is required.';
    if (!newCustomer.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required.';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(newCustomer.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format.';
    }
    return newErrors;
  };
  const handleAddCustomer = async () => {
    const newErrors = validateCustomer();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setLoading(true);
    try {
      // Dispatch registerCustomer action and unwrap to get the result or error
      await dispatch(registerCustomer(newCustomer)).unwrap();
  
      // If successful, show success toast
      toast({
        title: "Customer added.",
        description: "New customer has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Reset form and close modal
      onClose();
      setNewCustomer({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthdate: '',
        gender: '',
        phoneNumber: '',
      });
      setErrors({});
      
      // Fetch updated customers
      dispatch(fetchCustomers());
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error.",
        description: error.message || "An error occurred while adding the customer.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card width="100%" px="20px" py="10px">
      <Flex px="25px" mt="10px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Customer List
        </Text>
        <Flex align="center">
          <InputGroup size="sm" mr={4}>
            <InputLeftElement children={<SearchIcon color="gray.300" />} />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="filled"
              size="sm"
            />
          </InputGroup>
          <Button onClick={onOpen} colorScheme="blue">
            Add New
          </Button>
        </Flex>
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="10px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex justify="space-between" align="center" mt={4}>
        <Button onClick={handlePreviousPage} isDisabled={currentPage === 0}>
          Previous
        </Button>
        <Text>
          Page {currentPage + 1} of {totalPages}
        </Text>
        <Button onClick={handleNextPage} isDisabled={currentPage >= totalPages - 1}>
          Next
        </Button>
      </Flex>

      {/* Add New Customer Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="lg">
          <ModalHeader fontSize="xl" fontWeight="bold">Add New Customer</ModalHeader>
          <ModalBody>
            <FormControl isInvalid={!!errors.firstName} isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                value={newCustomer.firstName}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, firstName: e.target.value });
                  setErrors((prev) => ({ ...prev, firstName: '' }));
                }}
                variant="filled"
                placeholder="Enter first name"
              />
              <FormErrorMessage>{errors.firstName}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.lastName} isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                value={newCustomer.lastName}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, lastName: e.target.value });
                  setErrors((prev) => ({ ...prev, lastName: '' }));
                }}
                variant="filled"
                placeholder="Enter last name"
              />
              <FormErrorMessage>{errors.lastName}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.email} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={newCustomer.email}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, email: e.target.value });
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                variant="filled"
                placeholder="Enter email address"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.password} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={newCustomer.password}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, password: e.target.value });
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                variant="filled"
                placeholder="Enter password"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.birthdate} isRequired>
              <FormLabel>Birthdate</FormLabel>
              <Input
                type="date"
                value={newCustomer.birthdate}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, birthdate: e.target.value });
                  setErrors((prev) => ({ ...prev, birthdate: '' }));
                }}
                variant="filled"
              />
              <FormErrorMessage>{errors.birthdate}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.gender} isRequired>
              <FormLabel>Gender</FormLabel>
              <Select
                value={newCustomer.gender}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, gender: e.target.value });
                  setErrors((prev) => ({ ...prev, gender: '' }));
                }}
                placeholder="Select gender"
                variant="filled"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
              <FormErrorMessage>{errors.gender}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.phoneNumber} isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={newCustomer.phoneNumber}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, phoneNumber: e.target.value });
                  setErrors((prev) => ({ ...prev, phoneNumber: '' }));
                }}
                variant="filled"
                placeholder="Enter phone number"
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleAddCustomer} isLoading={loading}>Add Customer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
