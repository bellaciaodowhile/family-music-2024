import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle } from "@nextui-org/react";
import { client } from "../supabase/client";

export const Navigation = () => {

    return(
        <>
            <Navbar shouldHideOnScroll isBordered>
                <NavbarBrand>
                    <p className="font-bold text-inherit">
                        LOGO
                    </p>
                    <NavbarContent className="sm:hidden" justify="start">
                        <NavbarMenuToggle />
                    </NavbarContent>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Button as={Link} onClick={ ()=> client.auth.signOut() } color="primary" href="#" variant="flat">
                            Cerrar sesión
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    )
}