import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";
import avienLogo from "../../../assets/img/auth/avDBLogo.png"

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <img src={avienLogo} alt="Avien Logo" />
      <HSeparator mb='20px' />
      {/* <h1 >Avien</h1> */}
    </Flex>
  );
}

export default SidebarBrand;
