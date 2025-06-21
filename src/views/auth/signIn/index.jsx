import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box, Button, Checkbox, Flex, FormControl, FormLabel, Heading, Icon, Input, InputGroup, InputRightElement, Text, useColorModeValue, useToast
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/avien.jpg";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../store/auth-slice/index';

function SignIn() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorBrand = useColorModeValue("brand.500", "white");

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role, error } = useSelector((state) => state.auth);
  const toast = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;

    // Dispatch login action
    const resultAction = await dispatch(loginUser({ email, password }));

    // Handle result
    if (loginUser.rejected.match(resultAction)) {
      // Extract error message from the action
      const errorMessage = resultAction.error.message || 'An unknown error occurred';
      console.error("Login error:", errorMessage); // Debug log for errors
      toast({
        title: "Login Failed",
        description: errorMessage,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Login Successful!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Handle navigation after login
  useEffect(() => {
    if (token) {
      if (role === 'admin') {
        navigate('/admin/brand/list');
      } else {
        toast({
          title: "Access Denied",
          description: "You are not authorized to access the admin panel.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }, [token, role, navigate, toast]);

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Email<Text color="red.500">*</Text>
              </FormLabel>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="mail@gmail.com"
                mb="24px"
                fontWeight="500"
                size="lg"
              />
              {errors.email && <Text color="red.500">{errors.email.message}</Text>}

              <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
                Password<Text color="red.500">*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && <Text color="red.500">{errors.password.message}</Text>}

              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox id="remember-login" colorScheme="brandScheme" me="10px" />
                  <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal" color={textColor} fontSize="sm">
                    Keep me logged in
                  </FormLabel>
                </FormControl>
                <NavLink to="/auth/forgot-password">
                  <Text color={textColorBrand} fontSize="sm" w="124px" fontWeight="500">
                    Forgot password?
                  </Text>
                </NavLink>
              </Flex>

              <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" type="submit">
                Sign In
              </Button>
              {error && <Text color="red.500">{typeof error === 'string' ? error : error.message}</Text>}
            </FormControl>
          </form>

          <div>
            <h3>Use this credential to sign in:</h3>
            <p>Email: anu1@gmail.com</p>
            <p>Password: anu1234567890</p>
          </div>
          
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
