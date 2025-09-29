import React from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react";
import Logo from "../assets/Logo.svg"

export const LogoAster = () => {
  return (
    <img src={Logo}
    alt="Logo Asterium"
    width={36}
    height={36}
    className='logo'
      />
  );
};

const NavBar =() =>{
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <LogoAster />
        <p className="font-bold text-inherit">ASTERIUM</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link aria-current="page" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="/explore">
            Explore
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/about">
            About
          </Link>
        </NavbarItem>
                <NavbarItem isActive>
          <Link aria-current="page" href="/contact">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
export default NavBar;