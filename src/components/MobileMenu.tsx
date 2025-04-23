import { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, IconButton } from '@mui/material';
import { Close as CloseIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Link from 'next/link';
import MobileProductsMenu from './MobileProductsMenu';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [showProducts, setShowProducts] = useState(false);

  const menuItems = [
    { text: 'Tüm Ürünler', href: '#', onClick: () => setShowProducts(true) },
    { text: 'Biz Kimiz?', href: '#' },
    { text: 'Bağış Kültürü', href: '#' },
    { text: 'Regl Testi!', href: '#' },
    { text: 'Kendi Paketini Oluştur', href: '/packets' },
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      onClose();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: '400px',
          bgcolor: '#F7F6F5',
          p: 0
        }
      }}
    >
      {showProducts ? (
        <MobileProductsMenu onBack={() => setShowProducts(false)} />
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ p: 2 }}>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text} 
                onClick={() => handleItemClick(item)}
                sx={{ 
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#F6F2ED',
                  }
                }}
              >
                {item.href && !item.onClick ? (
                  <Link href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
                    <ListItemText 
                      primary={item.text} 
                      sx={{ 
                        color: '#000',
                        '& .MuiTypography-root': {
                          fontSize: '18px',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Link>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <ListItemText 
                      primary={item.text} 
                      sx={{ 
                        color: '#000',
                        '& .MuiTypography-root': {
                          fontSize: '18px',
                          fontWeight: 500
                        }
                      }}
                    />
                    {item.text === 'Tüm Ürünler' && <ChevronRightIcon sx={{ color: '#000' }} />}
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Drawer>
  );
};

export default MobileMenu; 