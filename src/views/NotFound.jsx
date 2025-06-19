import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bg="gray.100"
      p={5}
    >
      <Heading as="h1" size="2xl" mb={4}>
        404 - Page Not Found
      </Heading>
      <Text fontSize="lg" mb={6}>
        Sorry, the page you are looking for does not exist.
      </Text>
      <Button 
        colorScheme="teal" 
        onClick={() => navigate('/')} // Navigate to home or any desired route
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
