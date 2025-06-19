import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/avien.jpg";
import { FcGoogle } from "react-icons/fc";
import { FaChevronLeft } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../../store/auth-slice/";

// Validation schema
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function SignUp() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role, error, isLoading } = useSelector((state) => state.auth);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const { username, email, password } = data;

    try {
      const resultAction = await dispatch(signupUser({ username, email, password }));
      if (signupUser.fulfilled.match(resultAction)) {
        // Success toast and navigation to dashboard
        toast({
          title: "Sign Up Successful",
          description: "New admin created successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate("/admin/dashboard");
      }
    } catch (err) {
      // Log the error for debugging
      console.error("Sign Up Error:", err);

      // Ensure error message is a string
      const errorMessage = err?.response?.data?.message || err.message || "An error occurred during sign-up";

      // Error toast
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <NavLink
        to='/admin/dashboard'
        style={{ width: "fit-content", marginTop: "40px" }}>
        <Flex align='center' ps={{ base: "25px", lg: "0px" }} w='fit-content'>
          <Icon as={FaChevronLeft} me='12px' h='13px' w='8px' color='secondaryGray.600' />
          <Text ms='0px' fontSize='sm' color='secondaryGray.600'>
            Back to Dashboard
          </Text>
        </Flex>
      </NavLink>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
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
            Sign Up
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your details to create an account!
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
          mb={{ base: "20px", md: "auto" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Username<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                type="text"
                placeholder="username"
                mb="24px"
                fontWeight="500"
                size="lg"
                {...register("username")}
              />
              {errors.username && (
                <Text color="red.500">{errors.username.message}</Text>
              )}

              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="mail@gmail.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                {...register("email")}
              />
              {errors.email && (
                <Text color="red.500">{errors.email.message}</Text>
              )}

              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                  {...register("password")}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color="gray.400"
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <Text color="red.500">{errors.password.message}</Text>
              )}

              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Confirm Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  fontSize="sm"
                  placeholder="Confirm your password"
                  mb="24px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                  {...register("confirmPassword")}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color="gray.400"
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.confirmPassword && (
                <Text color="red.500">{errors.confirmPassword.message}</Text>
              )}
              
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                isLoading={isLoading}
              >
                Sign Up
              </Button>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
