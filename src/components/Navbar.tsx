'use client';

import { useState } from 'react';
import { AppBar, Box, Container, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Image from 'next/image';
import ProductsMenu from './ProductsMenu';

const NavContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '80px',
  padding: '0 24px',
});

const NavLink = styled(Typography)({
  color: '#000',
  fontSize: '16px',
  fontWeight: 400,
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'color 0.2s ease-in-out',
  '&:hover': {
    color: '#666',
  },
});

const ProductsButton = styled(Box)({
  position: 'relative',
  cursor: 'pointer',
  padding: '8px 0',
});

const DesktopNav = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const MobileNav = styled(Stack)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
  },
}));

const IconButtonStyled = styled(IconButton)({
  padding: '8px',
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#F6F2ED',
  },
});

export default function Navbar() {
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: '#fff',
        boxShadow: 'none',
        borderBottom: '1px solid #F6F2ED',
        zIndex: 1100,
      }}
    >
      <NavContainer maxWidth="lg">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#CE7328',
              fontWeight: 700,
              fontSize: '1.5rem',
            }}
          >
            beije
          </Typography>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav direction="row" spacing={4} alignItems="center">
          <ProductsButton
            onMouseEnter={() => setIsProductsMenuOpen(true)}
            onMouseLeave={() => setIsProductsMenuOpen(false)}
          >
            <NavLink>Tüm Ürünler</NavLink>
            <ProductsMenu isOpen={isProductsMenuOpen} />
          </ProductsButton>
          <Link href="/about" passHref style={{ textDecoration: 'none' }}>
            <NavLink>Biz Kimiz?</NavLink>
          </Link>
          <Link href="/donation" passHref style={{ textDecoration: 'none' }}>
            <NavLink>Bağış Kültürü</NavLink>
          </Link>
          <Link href="/period-test" passHref style={{ textDecoration: 'none' }}>
            <NavLink>Regl Testi!</NavLink>
          </Link>
          <Link href="/create-package" passHref style={{ textDecoration: 'none' }}>
            <NavLink>Kendi Paketini Oluştur</NavLink>
          </Link>
        </DesktopNav>



        {/* Cart & Account Icons */}
        <Stack direction="row" spacing={2}>
          <IconButtonStyled>
            <Image src="/images/cart.svg" alt="Cart" width={24} height={24} />
          </IconButtonStyled>
          <IconButtonStyled>
            <Image src="/images/account.svg" alt="Account" width={24} height={24} />
          </IconButtonStyled>
                  {/* Mobile Navigation */}
        <MobileNav direction="row" spacing={2} alignItems="center">
          <IconButtonStyled>
            <Image src="/images/menu.svg" alt="Menu" width={24} height={24} />
          </IconButtonStyled>
        </MobileNav>
        </Stack>
      </NavContainer>
    </AppBar>
  );
} 