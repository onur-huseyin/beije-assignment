import { Box, Typography, List, ListItem, ListItemText, IconButton, Chip } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Link from 'next/link';

interface MobileProductsMenuProps {
  onBack: () => void;
}

const MobileProductsMenu = ({ onBack }: MobileProductsMenuProps) => {
  const packages = [
    { icon: '🎁', text: 'Popüler Paketler', href: '#' },
    { icon: '🩸', text: 'Ped Paketleri', href: '#' },
    { icon: '🌸', text: 'Günlük Ped Paketleri', href: '#' },
    { icon: '🌺', text: 'Tampon Paketleri', href: '#' },
    { icon: '📦', text: 'Deneme Paketi', href: '#' },
    { icon: '🎀', text: 'Özel Paketler', href: '#', isNew: true },
  ];

  const products = [
    { icon: '🩸', text: 'beije Ped', href: '#' },
    { icon: '🌸', text: 'beije Günlük Ped', href: '#' },
    { icon: '🌺', text: 'beije Tampon', href: '#' },
    { icon: '🎀', text: 'beije Külot', href: '#' },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Ürünler
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Paketler</Typography>
          <Link href="#" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: '#000', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
              Tüm Paketler
              <span style={{ marginLeft: '4px' }}>→</span>
            </Typography>
          </Link>
        </Box>
        <List>
          {packages.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              href={item.href}
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  bgcolor: '#F6F2ED',
                }
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '20px' }}>{item.icon}</span>
              <ListItemText primary={item.text} />
              {item.isNew && (
                <Chip
                  label="Yeni"
                  size="small"
                  sx={{
                    bgcolor: '#D2E7E0',
                    color: '#000',
                    fontSize: '12px',
                    height: '24px',
                    ml: 1
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #E0E0E0' }}>
        <List>
          {products.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              href={item.href}
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  bgcolor: '#F6F2ED',
                }
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '20px' }}>{item.icon}</span>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default MobileProductsMenu; 