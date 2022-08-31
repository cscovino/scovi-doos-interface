import { Link as DefaultLink, LinkProps as DefaultLinkProps, useColorModeValue } from "@chakra-ui/react";
import { Link, LinkProps } from "react-router-dom";

const NavLink = (props: LinkProps & DefaultLinkProps) => (
  <DefaultLink
    px={2}
    py={1}
    as={Link}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    {...props}
  >
    {props.children}
  </DefaultLink>
);

export default NavLink;
