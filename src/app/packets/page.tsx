'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  Button,
  IconButton,
  Collapse,
  Paper,
  Divider,
  Chip,
  Tabs,
  Tab,
  Skeleton,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';
import { setProducts, setPackets, setSelectedProduct, clearSelectedProducts } from '@/store/slices/productsSlice';
import { setToken } from '@/store/slices/authSlice';
import { api } from '@/services/api';
import type { RootState } from '@/store/store';

interface SubProduct {
  _id: string;
  name: string;
  price: number;
}

interface Product {
  _id: string;
  title: string;
  image: string;
  type: 'Menstrual' | 'Other';
  subProducts: SubProduct[];
}

interface GroupedProduct {
  id: string;
  count: number;
  product: Product;
  subProduct: SubProduct;
}

export default function PacketsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, selectedProducts } = useSelector((state: RootState) => state.products);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [token, setTokenState] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(true);
        const response = await api.products.getProductsAndPackets();
        if (response.success) {
          dispatch(setProducts(response.data.products));
          dispatch(setPackets(response.data.packets));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const groupSelectedProducts = () => {
    const grouped = {
      Menstrual: [] as GroupedProduct[],
      Other: [] as GroupedProduct[]
    };

    Object.entries(selectedProducts).forEach(([id, count]) => {
      if (count > 0) {
        const product = products.find(p => p.subProducts.some(sp => sp._id === id));
        const subProduct = product?.subProducts.find(sp => sp._id === id);
        
        if (product && subProduct) {
          grouped[product.type].push({
            id,
            count,
            product,
            subProduct
          });
        }
      }
    });

    return grouped;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 16, mb: 16 }}>
      <Box sx={{ display: 'flex', gap: '32px', flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* Sol Panel - Ürünler */}
        <Box sx={{ flex: '1 1 400px' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Kendi Paketini Oluştur
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Döngünün uzunluğuna, kanamanın yoğunluğuna ve kullanmak istediğin ürünlere göre tamamen kendine özel bir paket oluştur!
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4, width: '100%' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="product categories"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#000',
                  },
                  '& .MuiTab-root': {
                    color: '#000',
                    '&.Mui-selected': {
                      color: '#000',
                    },
                  },
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Tab sx={{ width: '50%' }} label="Menstrual Ürünler" />
                <Tab sx={{ width: '50%' }} label="Destekleyici Ürünler" />
              </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                {isLoading ? (
                  Array.from(new Array(3)).map((_, index) => (
                    <Paper
                      key={index}
                      sx={{ mb: 2, overflow: 'hidden', bgcolor: '#FFF', border: 'none', borderRadius: '16px' }}
                      elevation={0}
                      variant="outlined"
                    >
                      <Box sx={{ p: 2 }}>
                        <Skeleton variant="text" width="60%" height={40} />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        {Array.from(new Array(3)).map((_, subIndex) => (
                          <Box key={subIndex} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Skeleton variant="text" width="40%" height={30} />
                            <Skeleton variant="rectangular" width={120} height={35} sx={{ borderRadius: '40px' }} />
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  ))
                ) : (
                  menstrualProducts.map((product) => (
                    <Paper
                      key={product._id}
                      sx={{ mb: 2, overflow: 'hidden', bgcolor: '#FFF', border: 'none', borderRadius: '16px' }}
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
                        <Box sx={{ p: 4, bgcolor: '#ECF1CF' }}>
                          <Typography variant="body2">
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                sx={{
                                  width: '50px',
                                  height: '25px',
                                  marginLeft: '-20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: '#EF4E25',
                                }}
                              >
                                <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.94025 19.2636C3.94025 20.6394 4.22349 23.7307 6.11715 25.0903C8.01081 26.4498 12.2999 25.6972 13.9265 25.503C15.5531 25.3088 15.367 26.903 15.5936 28.0603C15.8202 29.2175 16.8641 29.5898 17.3739 29.5898H19.9959C19.9959 29.5898 22.1081 29.5898 22.6179 29.5898C23.1278 29.5898 24.1717 29.2256 24.3983 28.0603C24.6249 26.8949 24.4387 25.3007 26.0654 25.503C27.692 25.7053 31.9729 26.4498 33.8747 25.0903C35.7765 23.7307 36.0516 20.6394 36.0516 19.2636C36.0516 17.8879 35.7684 14.7965 33.8747 13.437C31.981 12.0774 27.692 12.83 26.0654 13.0243C24.4387 13.2185 24.6249 11.6242 24.3983 10.467C24.1717 9.30976 23.1278 8.9375 22.6179 8.9375H19.9959C19.9959 8.9375 17.8838 8.9375 17.3739 8.9375C16.8641 8.9375 15.8202 9.30167 15.5936 10.467C15.367 11.6323 15.5531 13.2266 13.9265 13.0243C12.2999 12.8219 8.01891 12.0774 6.11715 13.437C4.21539 14.7965 3.94025 17.8879 3.94025 19.2636Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                                  <path d="M25.4665 16.5039H14.5334C13.139 16.5039 12.0085 17.6343 12.0085 19.0288V19.4901C12.0085 20.8845 13.139 22.015 14.5334 22.015H25.4665C26.861 22.015 27.9914 20.8845 27.9914 19.4901V19.0288C27.9914 17.6343 26.861 16.5039 25.4665 16.5039Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                                </svg>
                              </Box>
                              <Typography>{subProduct.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderRadius: '40px', border: '1px solid #00000026', padding: '10px' }}>
                              <Button
                                size="medium"
                                sx={{
                                  color: selectedProducts[subProduct._id] > 0 ? '#000' : '#00000040',
                                  minWidth: '30px',
                                  '&:hover': {
                                    backgroundColor: 'transparent'
                                  }
                                }}
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
                                size="medium"
                                sx={{
                                  color: '#000',
                                  minWidth: '30px',
                                  '&:hover': {
                                    backgroundColor: 'transparent'
                                  }
                                }}
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
                  ))
                )}
              </Box>
              <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                {isLoading ? (
                  Array.from(new Array(3)).map((_, index) => (
                    <Paper
                      key={index}
                      sx={{ mb: 2, overflow: 'hidden', bgcolor: '#FFF', border: 'none', borderRadius: '16px' }}
                      elevation={0}
                      variant="outlined"
                    >
                      <Box sx={{ p: 2 }}>
                        <Skeleton variant="text" width="60%" height={40} />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        {Array.from(new Array(2)).map((_, subIndex) => (
                          <Box key={subIndex} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Skeleton variant="text" width="40%" height={30} />
                            <Skeleton variant="rectangular" width={120} height={35} sx={{ borderRadius: '40px' }} />
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  ))
                ) : (
                  otherProducts.map((product) => (
                    <Paper
                      key={product._id}
                      sx={{ mb: 2, overflow: 'hidden', bgcolor: '#FFF', border: 'none', borderRadius: '16px' }}
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
                        <Box sx={{ p: 4, bgcolor: '#ECF1CF' }}>
                          <Typography variant="body2">
                            Destekleyici ürünlerimiz ile döngünüzü daha konforlu geçirin.
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                sx={{
                                  width: '50px',
                                  height: '25px',
                                  marginLeft: '-20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: '#EF4E25',
                                }}
                              >
                                <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.94025 19.2636C3.94025 20.6394 4.22349 23.7307 6.11715 25.0903C8.01081 26.4498 12.2999 25.6972 13.9265 25.503C15.5531 25.3088 15.367 26.903 15.5936 28.0603C15.8202 29.2175 16.8641 29.5898 17.3739 29.5898H19.9959C19.9959 29.5898 22.1081 29.5898 22.6179 29.5898C23.1278 29.5898 24.1717 29.2256 24.3983 28.0603C24.6249 26.8949 24.4387 25.3007 26.0654 25.503C27.692 25.7053 31.9729 26.4498 33.8747 25.0903C35.7765 23.7307 36.0516 20.6394 36.0516 19.2636C36.0516 17.8879 35.7684 14.7965 33.8747 13.437C31.981 12.0774 27.692 12.83 26.0654 13.0243C24.4387 13.2185 24.6249 11.6242 24.3983 10.467C24.1717 9.30976 23.1278 8.9375 22.6179 8.9375H19.9959C19.9959 8.9375 17.8838 8.9375 17.3739 8.9375C16.8641 8.9375 15.8202 9.30167 15.5936 10.467C15.367 11.6323 15.5531 13.2266 13.9265 13.0243C12.2999 12.8219 8.01891 12.0774 6.11715 13.437C4.21539 14.7965 3.94025 17.8879 3.94025 19.2636Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                                  <path d="M25.4665 16.5039H14.5334C13.139 16.5039 12.0085 17.6343 12.0085 19.0288V19.4901C12.0085 20.8845 13.139 22.015 14.5334 22.015H25.4665C26.861 22.015 27.9914 20.8845 27.9914 19.4901V19.0288C27.9914 17.6343 26.861 16.5039 25.4665 16.5039Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                                </svg>
                              </Box>
                              <Typography>{subProduct.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderRadius: '40px', border: '1px solid #00000026', padding: '10px' }}>
                              <Button
                                size="medium"
                                sx={{
                                  color: selectedProducts[subProduct._id] > 0 ? '#000' : '#00000040',
                                  minWidth: '30px',
                                  '&:hover': {
                                    backgroundColor: 'transparent'
                                  }
                                }}
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
                                size="medium"
                                sx={{
                                  color: '#000',
                                  minWidth: '30px',
                                  '&:hover': {
                                    backgroundColor: 'transparent'
                                  }
                                }}
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
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Sağ Panel - Seçilen Ürünler */}
        <Box sx={{ flex: '0 1 400px' }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20, bgColor: '#fff', borderRadius: '16px', maxWidth: '100%', width: '100%' }} elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, backgroundColor: '#fff' }}>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>Paketin</Typography>
              <Chip
                label="2 Ayda bir gönderim"
                color="primary"
                size="small"
                sx={{ bgcolor: '#D2E7E0', color: 'text.primary', fontWeight: 500 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Kişisel ihtiyacına yönelik istediğin miktarda ped, günlük ped, tampon veya destekleyici ürünler ekleyerek kendine özel paket oluşturabilirsin.
            </Typography>

            <Box sx={{ mt: 3 }}>
              {Object.entries(groupSelectedProducts()).map(([category, items]) => (
                items.length > 0 && (
                  <Box key={category}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: '#666' }}>
                      {category === 'Menstrual' ? 'Menstrual Ürünler' : 'Destekleyici Ürünler'}
                    </Typography>
                    {items.map(({ id, count, product, subProduct }) => (
                      <Box
                        key={id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: '50px',
                              height: '25px',
                              marginLeft: '-20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: '#EF4E25',
                            }}
                          >
                            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.94025 19.2636C3.94025 20.6394 4.22349 23.7307 6.11715 25.0903C8.01081 26.4498 12.2999 25.6972 13.9265 25.503C15.5531 25.3088 15.367 26.903 15.5936 28.0603C15.8202 29.2175 16.8641 29.5898 17.3739 29.5898H19.9959C19.9959 29.5898 22.1081 29.5898 22.6179 29.5898C23.1278 29.5898 24.1717 29.2256 24.3983 28.0603C24.6249 26.8949 24.4387 25.3007 26.0654 25.503C27.692 25.7053 31.9729 26.4498 33.8747 25.0903C35.7765 23.7307 36.0516 20.6394 36.0516 19.2636C36.0516 17.8879 35.7684 14.7965 33.8747 13.437C31.981 12.0774 27.692 12.83 26.0654 13.0243C24.4387 13.2185 24.6249 11.6242 24.3983 10.467C24.1717 9.30976 23.1278 8.9375 22.6179 8.9375H19.9959C19.9959 8.9375 17.8838 8.9375 17.3739 8.9375C16.8641 8.9375 15.8202 9.30167 15.5936 10.467C15.367 11.6323 15.5531 13.2266 13.9265 13.0243C12.2999 12.8219 8.01891 12.0774 6.11715 13.437C4.21539 14.7965 3.94025 17.8879 3.94025 19.2636Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                              <path d="M25.4665 16.5039H14.5334C13.139 16.5039 12.0085 17.6343 12.0085 19.0288V19.4901C12.0085 20.8845 13.139 22.015 14.5334 22.015H25.4665C26.861 22.015 27.9914 20.8845 27.9914 19.4901V19.0288C27.9914 17.6343 26.861 16.5039 25.4665 16.5039Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                            </svg>
                          </Box>
                          <Typography>
                            {count}x {subProduct.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography>{subProduct.price * count}₺</Typography>
                          <IconButton 
                            onClick={() => handleQuantityChange(id, 0)}
                            sx={{ 
                              color: '#000',
                              padding: '4px',
                              '&:hover': {
                                backgroundColor: 'transparent',
                                color: '#EF4E25'
                              }
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                    {category === 'Menstrual' && items.length > 0 && <Divider sx={{ my: 2 }} />}
                  </Box>
                )
              ))}
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
                borderRadius: '24px',
              }}
            >
              Sepete Ekle
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
} 