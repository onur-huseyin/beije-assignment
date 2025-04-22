'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  IconButton,
  Collapse,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { setProducts, setPackets, setSelectedProduct, clearSelectedProducts } from '@/store/slices/productsSlice';
import { setToken } from '@/store/slices/authSlice';
import { api } from '@/services/api';
import type { RootState } from '@/store/store';

export default function PacketsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, selectedProducts } = useSelector((state: RootState) => state.products);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setTokenState(storedToken);
    
    if (!storedToken) {
      router.replace('/login');
      return;
    }

    dispatch(setToken(storedToken));

    const fetchProducts = async () => {
      try {
        const response = await api.products.getProductsAndPackets();
        if (response.success) {
          dispatch(setProducts(response.data.products));
          dispatch(setPackets(response.data.packets));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [dispatch, router]);

  const handleQuantityChange = (productId: string, count: number) => {
    if (count >= 0) {
      dispatch(setSelectedProduct({ id: productId, count }));
    }
  };

  const calculateTotalPrice = () => {
    return Object.entries(selectedProducts).reduce((total, [id, count]) => {
      const product = products.find(p => p.subProducts.some(sp => sp._id === id));
      const subProduct = product?.subProducts.find(sp => sp._id === id);
      return total + (subProduct?.price || 0) * count;
    }, 0);
  };

  const handleAddToCart = async () => {
    if (!token) return;

    try {
      const packet = Object.entries(selectedProducts).map(([id, count]) => ({
        _id: id,
        count,
      }));

      const totalPrice = calculateTotalPrice();

      const response = await api.products.verifyPacketPrice(token, packet, totalPrice);
      if (response.success) {
        dispatch(clearSelectedProducts());
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const toggleSection = (productId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const menstrualProducts = products.filter(p => p.type === 'Menstrual');
  const otherProducts = products.filter(p => p.type === 'Other');

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 16, mb: 16, bgcolor: '#F7F6F5' }}>
      <div style={{ display: 'flex', gap: '32px', flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* Sol Panel - Ürünler */}
        <div style={{ flex: '1 1 600px' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Kendi Paketini Oluştur
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Döngünün uzunluğuna, kanamanın yoğunluğuna ve kullanmak istediğin ürünlere göre tamamen kendine özel bir paket oluştur!
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>
                Menstrual Ürünler
              </Typography>
              {menstrualProducts.map((product) => (
                <Paper
                  key={product._id}
                  sx={{ mb: 2, overflow: 'hidden' }}
                  elevation={0}
                  variant="outlined"
                >
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleSection(product._id)}
                  >
                    <Typography variant="h6">{product.title}</Typography>
                    <IconButton>
                      {expandedSections[product._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedSections[product._id]}>
                    <Box sx={{ p: 2, bgcolor: '#F8FFEB' }}>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Döngüleri yoğun geçen kullanıcıların X&apos;i günde 3 adet standart ped tercih ediyor.
                      </Typography>
                    </Box>
                    {product.subProducts.map((subProduct) => (
                      <Box
                        key={subProduct._id}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography>{subProduct.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuantityChange(
                              subProduct._id,
                              (selectedProducts[subProduct._id] || 0) - 1
                            )}
                          >
                            -
                          </Button>
                          <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                            {selectedProducts[subProduct._id] || 0}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuantityChange(
                              subProduct._id,
                              (selectedProducts[subProduct._id] || 0) + 1
                            )}
                          >
                            +
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Collapse>
                </Paper>
              ))}

              <Typography variant="h6" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2, mt: 4 }}>
                Destekleyici Ürünler
              </Typography>
              {otherProducts.map((product) => (
                <Paper
                  key={product._id}
                  sx={{ mb: 2, overflow: 'hidden' }}
                  elevation={0}
                  variant="outlined"
                >
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleSection(product._id)}
                  >
                    <Typography variant="h6">{product.title}</Typography>
                    <IconButton>
                      {expandedSections[product._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedSections[product._id]}>
                    {product.subProducts.map((subProduct) => (
                      <Box
                        key={subProduct._id}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography>{subProduct.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuantityChange(
                              subProduct._id,
                              (selectedProducts[subProduct._id] || 0) - 1
                            )}
                          >
                            -
                          </Button>
                          <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                            {selectedProducts[subProduct._id] || 0}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuantityChange(
                              subProduct._id,
                              (selectedProducts[subProduct._id] || 0) + 1
                            )}
                          >
                            +
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Collapse>
                </Paper>
              ))}
            </Box>
          </Box>
        </div>

        {/* Sağ Panel - Seçilen Ürünler */}
        <div style={{ flex: '0 1 400px' }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }} elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Paketin</Typography>
              <Chip
                label="2 Ayda bir gönderim"
                color="primary"
                size="small"
                sx={{ bgcolor: '#E6EEF1', color: 'text.primary' }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Kişisel ihtiyacına yönelik istediğin miktarda ped, günlük ped, tampon veya destekleyici ürünler ekleyerek kendine özel paket oluşturabilirsin.
            </Typography>

            <Box sx={{ mt: 3 }}>
              {Object.entries(selectedProducts).map(([id, count]) => {
                const product = products.find(p => p.subProducts.some(sp => sp._id === id));
                const subProduct = product?.subProducts.find(sp => sp._id === id);
                if (count > 0 && subProduct) {
                  return (
                    <Box
                      key={id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography>
                        {count}x {subProduct.name}
                      </Typography>
                      <Typography>{subProduct.price * count}₺</Typography>
                    </Box>
                  );
                }
                return null;
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Toplam</Typography>
              <Typography variant="h6">{calculateTotalPrice()}₺</Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              disabled={Object.keys(selectedProducts).length === 0}
              sx={{
                bgcolor: '#000',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
            >
              Sepete Ekle
            </Button>
          </Paper>
        </div>
      </div>
    </Container>
  );
} 