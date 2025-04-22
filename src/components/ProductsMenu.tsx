'use client';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const MenuContainer = styled(Box)({
  position: 'fixed',
  top: '80px',
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease-in-out',
  width: '100vw',
});

const MenuInner = styled(Box)({
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
  position: 'relative',
  padding: '32px 24px',
});

const SectionTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  color: '#000000E5',
  marginBottom: '24px',
});

const MenuContent = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '24px',
  '@media (min-width: 600px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  '@media (min-width: 960px)': {
    gridTemplateColumns: 'repeat(6, 1fr)',
  },
});

const MenuItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateX(5px)',
  },
});

const ImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '135px',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#F6F2ED',
  '@media (min-width: 960px)': {
    width: '172px',
  },
});

const MenuTitle = styled(Typography)({
  fontSize: '16px',
  fontWeight: 500,
  color: '#000',
  textAlign: 'left',
});

const products = [
  {
    id: 1,
    title: 'beije Ped',
    image: '/images/prod.png',
  },
  {
    id: 2,
    title: 'beije Günlük Ped',
    image: '/images/prod-3.png',
  },
  {
    id: 3,
    title: 'beije Tampon',
    image: '/images/prod-5.png',
  },
  {
    id: 4,
    title: 'Beije Kap',
    image: '/images/prod-5.png',
  },
  {
      id: 5,
      title: 'Beije Kap',
      image: '/images/prod-5.png',
    },
    {
      id: 6,
      title: 'Beije Kap',
      image: '/images/prod-7.png',
    },
  {
    id: 7,
    title: 'Isı Bandı',
    image: '/images/prod-9.png',
  },
  {
    id: 8,
    title: 'beije Supplement',
    image: '/images/prod-11.png',
  },
  {
      id: 9,
      title: 'beije Supplement',
      image: '/images/prod-11.png',
    },
    {
      id: 10,
      title: 'beije Supplement',
      image: '/images/prod-11.png',
    },
    {
      id: 11,
      title: 'beije Supplement',
      image: '/images/prod-12.png',
    },
    {
      id: 12,
      title: 'beije Supplement',
      image: '/images/prod-12.png',
    },
];

interface ProductsMenuProps {
  isOpen: boolean;
}

/**
 * ProductsMenu Komponenti
 * 
 * @description
 * Ürünler menüsünü gösteren komponent. Hover durumunda açılan ve kapanan bir menü sunar.
 * Menü içerisinde ürünler kategorize edilmiş şekilde listelenir.
 * 
 * @component
 * @example
 * ```tsx
 * <ProductsMenu isOpen={isMenuOpen} />
 * ```
 * 
 * @param {boolean} isOpen - Menünün açık/kapalı durumunu kontrol eden prop
 * @returns {JSX.Element} Ürünler menüsü komponenti
 */

const ProductsMenu = ({ isOpen }: ProductsMenuProps) => {
  return (
    <MenuContainer
      sx={{
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
      }}
    >
      <MenuInner>
        <SectionTitle>Ürünler</SectionTitle>
        <MenuContent>
          {products.map((product) => (
            <MenuItem key={product.id}>
              <ImageWrapper>
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </ImageWrapper>
              <Box sx={{display:'flex', alignItems:'center', gap:'8px', justifyContent:'space-between'}}>
              <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="15" // Oran koruma
    viewBox="0 0 22 15"
    fill="none"
  >
    <path
      d="M1.36414 7.55994C1.36414 8.38538 1.53408 10.2402 2.67028 11.0559C3.80648 11.8717 6.37992 11.4201 7.35588 11.3036C8.33185 11.187 8.22017 12.1436 8.35612 12.8379C8.49208 13.5323 9.11845 13.7556 9.42434 13.7556H10.9975C10.9975 13.7556 12.2648 13.7556 12.5707 13.7556C12.8766 13.7556 13.503 13.5371 13.639 12.8379C13.7749 12.1387 13.6632 11.1822 14.6392 11.3036C15.6152 11.425 18.1838 11.8717 19.3248 11.0559C20.4659 10.2402 20.6309 8.38538 20.6309 7.55994C20.6309 6.73449 20.461 4.87967 19.3248 4.06394C18.1886 3.24821 15.6152 3.69978 14.6392 3.81631C13.6632 3.93284 13.7749 2.9763 13.639 2.28196C13.503 1.58761 12.8766 1.36426 12.5707 1.36426H10.9975C10.9975 1.36426 9.73024 1.36426 9.42434 1.36426C9.11845 1.36426 8.49208 1.58276 8.35612 2.28196C8.22017 2.98116 8.33185 3.9377 7.35588 3.81631C6.37992 3.69492 3.81133 3.24821 2.67028 4.06394C1.52922 4.87967 1.36414 6.73449 1.36414 7.55994Z"
      stroke="#343131"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M14.28 5.90405H7.72013C6.88346 5.90405 6.2052 6.58231 6.2052 7.41898V7.69575C6.2052 8.53242 6.88346 9.21068 7.72013 9.21068H14.28C15.1167 9.21068 15.7949 8.53242 15.7949 7.69575V7.41898C15.7949 6.58231 15.1167 5.90405 14.28 5.90405Z"
      stroke="#343131"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
  </svg>
              <MenuTitle>{product.title}</MenuTitle>
              <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="#343131"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
              </Box>
            </MenuItem>
          ))}
        </MenuContent>
      </MenuInner>
    </MenuContainer>
  );
}

export default ProductsMenu; 