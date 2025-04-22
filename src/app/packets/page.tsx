/**
 * PacketsPage Komponenti
 * 
 * @description
 * Paket seçim sayfası komponenti. Menstrual ve Destekleyici ürünlerin listelendiği,
 * ürün seçimi ve miktar ayarlaması yapılabildiği, seçilen ürünlerin özetlendiği sayfa.
 * 
 * Özellikler:
 * - Ürünleri kategorilere göre (Menstrual/Destekleyici) ayırır ve listeler
 * - Her ürün için miktar seçimi yapılabilir (10'ar adetlik paketler halinde)
 * - Seçilen ürünlerin toplam fiyatını hesaplar
 * - Sepete ekleme işlemini yönetir
 * - Ürün seçimlerini localStorage'da saklar
 * - Yükleme durumlarını yönetir
 * 
 * @component
 * @example
 * ```tsx
 * <PacketsPage />
 * ```
 * 
 * @returns {JSX.Element} Paket seçim sayfası komponenti
 * 
 * @test
 * - ✓ Başlangıçta yükleme durumunu gösterir
 * - ✓ Yükleme tamamlandığında ürünleri gösterir
 * - ✓ Ürün seçimini yönetir
 * - ✓ Miktar değişikliklerini yönetir
 * - ✓ Toplam fiyatı doğru hesaplar
 */

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
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { setProducts, setPackets, setSelectedProduct, clearSelectedProducts } from '@/store/slices/productsSlice';
import { setToken } from '@/store/slices/authSlice';
import { api } from '@/services/api';
import type { RootState } from '@/store/store';
import { toast } from 'sonner';

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
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setTokenState(storedToken);
    
    if (!storedToken) {
      router.replace('/login');
      return;
    }

    dispatch(setToken(storedToken));

    // Kayıtlı ürünleri localStorage'dan al
    const savedProducts = localStorage.getItem('selectedProducts');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      Object.entries(parsedProducts).forEach(([id, count]) => {
        dispatch(setSelectedProduct({ id, count: Number(count) }));
      });
    }

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

  // Seçilen ürünler değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const handleQuantityChange = (productId: string, count: number) => {
    if (count >= 0) {
      dispatch(setSelectedProduct({ id: productId, count }));
    }
  };

  const calculateTotalPrice = () => {
    return Object.entries(selectedProducts).reduce((total, [id, count]) => {
      const product = products.find(p => p.subProducts.some(sp => sp._id === id));
      const subProduct = product?.subProducts.find(sp => sp._id === id);
      // Her 10'luk paket için bir fiyat ekliyoruz
      return total + (subProduct?.price || 0) * (count / 10);
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
        localStorage.removeItem('selectedProducts');
        toast.success('Ürünler sepete eklendi!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Sepete eklerken bir hata oluştu!');
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

  const getProductColor = (name: string) => {
    switch (name) {
      case 'Standart Ped':
        return '#EF4E25'; // Turuncu
      case 'Süper Ped':
        return '#B4362B'; // Kırmızımsı
      case 'Süper+ Ped':
        return '#610D00'; // Koyu kırmızı
      case 'Mini Tampon':
        return '#EF4E25';
      case 'Standard Tampon':
        return '#B4362B';
      case 'Süper Tampon':
        return '#6D1D19';
      default:
        return '#EF4E25';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 16, mb: { xs: 16, md: 16 } }}>
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
                                  bgcolor: getProductColor(subProduct.name),
                                }}
                              >
                                <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.94025 19.2636C3.94025 20.6394 4.22349 23.7307 6.11715 25.0903C8.01081 26.4498 12.2999 25.6972 13.9265 25.503C15.5531 25.3088 15.367 26.903 15.5936 28.0603C15.8202 29.2175 16.8641 29.5898 17.3739 29.5898H19.9959C19.9959 29.5898 22.1081 29.5898 22.6179 29.5898C23.1278 29.5898 24.1717 29.2256 24.3983 28.0603C24.6249 26.8949 24.4387 25.3007 26.0654 25.503C27.692 25.7053 31.9729 26.4498 33.8747 25.0903C35.7765 23.7307 36.0516 20.6394 36.0516 19.2636C36.0516 17.8879 35.7684 14.7965 33.8747 13.437C31.981 12.0774 27.692 12.83 26.0654 13.0243C24.4387 13.2185 24.6249 11.6242 24.3983 10.467C24.1717 9.30976 23.1278 8.9375 22.6179 8.9375H19.9959C19.9959 8.9375 17.8838 8.9375 17.3739 8.9375C16.8641 8.9375 15.8202 9.30167 15.5936 10.467C15.367 11.6323 15.5531 13.2266 13.9265 13.0243C12.2999 12.8219 8.01891 12.0774 6.11715 13.437C4.21539 14.7965 3.94025 17.8879 3.94025 19.2636Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                                  <path d="M25.4665 16.5039H14.5334C13.139 16.5039 12.0085 17.6343 12.0085 19.0288V19.4901C12.0085 20.8845 13.139 22.015 14.5334 22.015H25.4665C26.861 22.015 27.9914 20.8845 27.9914 19.4901V19.0288C27.9914 17.6343 26.861 16.5039 25.4665 16.5039Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
                                </svg>
                              </Box>
                              <Typography sx={{ fontSize: '18px', fontWeight: 500 }}>{subProduct.name}</Typography>
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
                                  Math.max(0, ((selectedProducts[subProduct._id] || 0) / 10 - 1) * 10)
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
                                  ((selectedProducts[subProduct._id] || 0) / 10 + 1) * 10
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
                        <Box sx={{ p: 4, bgcolor: '#ECF1CF', m: 4, borderRadius: '16px' }}>
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
                                  bgcolor: getProductColor(subProduct.name),
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
                                  Math.max(0, ((selectedProducts[subProduct._id] || 0) / 10 - 1) * 10)
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
                                  ((selectedProducts[subProduct._id] || 0) / 10 + 1) * 10
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

        {/* Masaüstü Panel */}
        <Box sx={{ flex: '0 1 400px', display: { xs: 'none', md: 'block' } }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20, bgcolor: '#fff', borderRadius: '16px', maxWidth: '100%', width: '100%' }} elevation={0}>
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
                    <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 600 }}>
                      {category === 'Menstrual' ? 'Menstrual Ürünler' : 'Destekleyici Ürünler'}
                    </Typography>
                    {items.map(({ id, count, subProduct }) => (
                      <Box
                        key={id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                          p: 2,
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          border: '1px solid #E0E0E0'
                        }}
                      >
                        <Typography>
                          {count}x {subProduct.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography>{subProduct.price}₺</Typography>
                          <IconButton 
                            onClick={() => handleQuantityChange(id, 0)}
                            sx={{ 
                              color: '#000',
                              padding: '4px',
                              '&:hover': {
                                color: '#EF4E25'
                              }
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                              <path d="M16 6v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 2 13.92 2 12.8 2h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 3.52 8 4.08 8 5.2V6m2 5.5v5m4-5v5M3 6h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 22 15.88 22 14.2 22H9.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C5 19.72 5 18.88 5 17.2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                    {category === 'Menstrual' && items.length > 0 && <Divider sx={{ my: 2 }} />}
                  </Box>
                )
              ))}
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleAddToCart}
              disabled={Object.keys(selectedProducts).length === 0}
              sx={{
                bgcolor: '#000',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#333',
                },
                borderRadius: '24px',
                mt: 2
              }}
            >
              Sepete Ekle ({calculateTotalPrice()}₺)
            </Button>
          </Paper>
        </Box>

        {/* Mobil Panel */}
        <Box sx={{ 
          display: { xs: 'block', md: 'none' }, 
          width: '100%', 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          zIndex: 1000,
          maxHeight: '80vh'
        }}>
          <Paper 
            sx={{ 
              width: '100%',
              borderRadius: '24px 24px 0 0',
              boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.1)',
              bgcolor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100%'
            }} 
            elevation={0}
          >
            <Box sx={{ p: 3, borderBottom: showDetails ? '1px solid #eee' : 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setShowDetails(!showDetails)}>
                  <Typography variant="h6" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Toplam
                    <IconButton size="small" sx={{ ml: 1 }}>
                      {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    ₺{calculateTotalPrice()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Collapse in={showDetails}>
              <Box 
                sx={{ 
                  overflowY: 'auto',
                  maxHeight: 'calc(80vh - 180px)',
                  px: 3,
                  pb: 3,
                  '&::-webkit-scrollbar': {
                    width: '6px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '3px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '3px'
                  }
                }}
              >
                {Object.entries(groupSelectedProducts()).map(([category, items]) => (
                  items.length > 0 && (
                    <Box key={category}>
                      <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 600, mb: 2 }}>
                        {category === 'Menstrual' ? 'Menstrual Ürünler' : 'Destekleyici Ürünler'}
                      </Typography>
                      {items.map(({ id, count, subProduct }) => (
                        <Box
                          key={id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            p: 2,
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #E0E0E0'
                          }}
                        >
                          <Typography>
                            {count}x {subProduct.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography>{subProduct.price}₺</Typography>
                            <IconButton 
                              onClick={() => handleQuantityChange(id, 0)}
                              sx={{ 
                                color: '#000',
                                padding: '4px',
                                '&:hover': {
                                  color: '#EF4E25'
                                }
                              }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                <path d="M16 6v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 2 13.92 2 12.8 2h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 3.52 8 4.08 8 5.2V6m2 5.5v5m4-5v5M3 6h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 22 15.88 22 14.2 22H9.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C5 19.72 5 18.88 5 17.2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                      {category === 'Menstrual' && items.length > 0 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  )
                ))}
              </Box>
            </Collapse>

            <Box sx={{ p: 3, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddToCart}
                disabled={Object.keys(selectedProducts).length === 0}
                sx={{
                  bgcolor: '#000',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#333',
                  },
                  borderRadius: '24px',
                  py: 1.5,
                  fontSize: '16px',
                  textTransform: 'none'
                }}
              >
                Sepete Ekle
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
} 