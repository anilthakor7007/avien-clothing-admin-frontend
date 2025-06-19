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
  useToast,
  InputGroup,
  InputLeftElement,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  sortingFns,
} from '@tanstack/react-table';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../../../../store/order-slice/orderSlice';

const columnHelper = createColumnHelper();

export default function ShowOrders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const [data, setData] = React.useState(orders);
  const toast = useToast();

  // Search State
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredData, setFilteredData] = React.useState(orders);

  // Sorting State
  const [sorting, setSorting] = React.useState([]);

  // Modal States
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState('');

  React.useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  React.useEffect(() => {
    setData(orders);
  }, [orders]);

  React.useEffect(() => {
    const filteredOrders = orders.filter((order) => {
      const customerName = order.customer
        ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`
        : '';
      return (
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order._id ? order._id.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
        (order.orderStatus ? order.orderStatus.toLowerCase() : '').includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filteredOrders);
  }, [searchTerm, orders]);

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus); // Default status as current order status
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleStatusSubmit = async () => {
    if (newStatus && selectedOrder) {
      try {
        // Ensure that only the orderStatus is updated, not the customer data
        const updatedOrder = {
          ...selectedOrder,
          orderStatus: newStatus, // Only modify the status
        };

        // Dispatch update action with only the order status change
        await dispatch(updateOrderStatus({ orderId: selectedOrder._id, orderStatus: newStatus }));

        // Update selectedOrder to reflect the new status and preserve the customer data
        setSelectedOrder(updatedOrder);

        toast({
          title: 'Status Updated.',
          description: 'Order status has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setIsStatusModalOpen(false);
        setSelectedOrder(null);
      } catch (error) {
        toast({
          title: 'Error.',
          description: 'There was an issue updating the order status.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        await dispatch(deleteOrder(selectedOrder._id));
        toast({
          title: 'Order Deleted.',
          description: 'The order has been deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsDeleteConfirmationOpen(false);
        setSelectedOrder(null);

        dispatch(fetchOrders());
      } catch (error) {
        toast({
          title: 'Error.',
          description: 'There was an issue deleting the order.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const columns = [
    columnHelper.accessor('orderId', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          ORDER ID
        </Text>
      ),
      cell: (info) => <Text>{info.row.original._id}</Text>,
    }),
    columnHelper.accessor('customerName', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          CUSTOMER NAME
        </Text>
      ),
      cell: ({ row }) => {
        const { firstName = 'N/A', lastName = 'N/A' } = row.original.customer || {};
        return <Text>{`${firstName} ${lastName}`}</Text>;
      },
      enableSorting: true,  // Enable sorting for this column
    }),
    columnHelper.accessor('orderDate', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          ORDER DATE
        </Text>
      ),
      cell: (info) => {
        const orderDate = new Date(info.row.original.createdAt).toLocaleString();
        return <Text>{orderDate || 'N/A'}</Text>;
      },
      enableSorting: true,  // Enable sorting for this column
      sortingFn: sortingFns.date, // Sorting function for dates
    }),
    columnHelper.accessor('status', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          STATUS
        </Text>
      ),
      cell: (info) => <Text>{info.row.original.orderStatus || 'N/A'}</Text>,
      // No sorting here for 'status'
    }),
    columnHelper.accessor('totalAmount', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          TOTAL AMOUNT
        </Text>
      ),
      cell: (info) => `₹${info.getValue() || '0'}`,
    }),
    columnHelper.accessor('shippingAddress', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          SHIPPING ADDRESS
        </Text>
      ),
      cell: (info) => {
        const address = info.getValue();
        if (address) {
          return (
            <>
              <Text>{address.line1 || 'N/A'}</Text>
              <Text>{address.line2 || 'N/A'}</Text>
              <Text>{address.city || 'N/A'}</Text>
              <Text>{address.state || 'N/A'}</Text>
              <Text>{address.zipCode || 'N/A'}</Text>
              <Text>{address.country || 'N/A'}</Text>
            </>
          );
        } else {
          return <Text>No address available</Text>;
        }
      },
    }),
    columnHelper.accessor('actions', {
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          ACTIONS
        </Text>
      ),
      cell: (info) => (
        <Flex direction="column" align="center">
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => handleUpdateStatus(info.row.original)}
            leftIcon={<MdEdit />}
            mb={2}
          >
            Update Status
          </Button>
          <Button
            colorScheme="green"
            size="sm"
            onClick={() => handleViewDetails(info.row.original)}
            leftIcon={<MdVisibility />}
          >
            View Details
          </Button>
          <Button
            colorScheme="green"
            size="sm"
            mt={2}
            onClick={() => handleDeletion(info.row.original)}
            leftIcon={<MdDelete />}
          >
            Delete Order
          </Button>
        </Flex>
      ),
    }),
  ];

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };
  const handleDeletion = (order) => {
    setSelectedOrder(order);
    setIsDeleteConfirmationOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(filteredData.length / 10);
  const [currentPage, setCurrentPage] = React.useState(0);

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

  return (
    <Card width="100%" px="20px" py="10px">
      <Flex px="25px" mt="10px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Order List
        </Text>
        <Flex align="center">
          <InputGroup size="sm" width="200px">
            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search by customer, order ID, or status"
              borderColor={borderColor}
              size="sm"
            />
          </InputGroup>
        </Flex>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <Text as="span">
                      {header.column.getIsSorted()
                        ? header.column.getIsSorted() === 'desc'
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </Text>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Status Update Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={closeStatusModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Order Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Order ID: {selectedOrder?._id}</Text>
            <Text>Customer Name: {selectedOrder?.customer?.firstName} {selectedOrder?.customer?.lastName}</Text>
            <Select value={newStatus} onChange={handleStatusChange}>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleStatusSubmit}>Save</Button>
            <Button onClick={closeStatusModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
       
     {/* { delete confirmation modal } */}
<Modal isOpen={isDeleteConfirmationOpen} onClose={() => setIsDeleteConfirmationOpen(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Delete Order</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Text>Are you sure you want to delete this order?</Text>
      <Text>Order ID: {selectedOrder?._id}</Text>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="red" onClick={handleDeleteOrder}>Delete</Button>
      <Button onClick={() => setIsDeleteConfirmationOpen(false)}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

      {/* Order Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={closeDetailsModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <>
                <Text fontWeight="bold">Order ID:</Text>
                <Text>{selectedOrder._id}</Text>
                <Text fontWeight="bold">Customer Name:</Text>
                <Text>{`${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`}</Text>
                <Text fontWeight="bold">Order Date:</Text>
                <Text>{new Date(selectedOrder.createdAt).toLocaleString()}</Text>
                <Text fontWeight="bold">Total Amount:</Text>
                <Text>₹{selectedOrder.totalAmount}</Text>
                <Text fontWeight="bold">Shipping Address:</Text>
                <Box>
                  <Text>{selectedOrder.shippingAddress?.line1}</Text>
                  <Text>{selectedOrder.shippingAddress?.line2}</Text>
                  <Text>{selectedOrder.shippingAddress?.city}</Text>
                  <Text>{selectedOrder.shippingAddress?.state}</Text>
                  <Text>{selectedOrder.shippingAddress?.zipCode}</Text>
                  <Text>{selectedOrder.shippingAddress?.country}</Text>
                </Box>
                <Text fontWeight="bold">Items:</Text>
                {selectedOrder.items?.map((item, index) => (
                  <Box key={index} mb={2}>
                    <Text>Name: {item.product?.name || 'N/A'}</Text>
                    <Text>Size: {item.size || 'N/A'}</Text>
                    <Text>Price: ₹{item.price || 'N/A'}</Text>
                    <Text>Quantity: {item.quantity || 'N/A'}</Text>
                  </Box>
                ))}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>

    
  );


}
