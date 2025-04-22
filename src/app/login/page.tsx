'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Box, Typography, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setToken, setProfile } from '@/store/slices/authSlice';
import { api } from '@/services/api';
import Image from 'next/image';
import type { RootState } from '@/store/store';
import { toast } from 'sonner';

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      router.replace('/packets');
    }
  }, [token, router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('E-posta adresi zorunludur');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Geçerli bir e-posta adresi giriniz');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Şifre zorunludur');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form validasyonu
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.auth.login(email, password);
      
      if (response.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        dispatch(setToken(token));
        
        const profileResponse = await api.auth.getProfile(token);
        if (profileResponse.success) {
          dispatch(setProfile(profileResponse.data));
          toast.success('Giriş başarılı!');
          router.push('/packets');
        }
      } else {
        toast.error('Email veya şifre hatalı!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 12px)', display: 'flex', height: '120vh', padding: '40px 0' }}>
      {/* Sol taraf - Ürün görselleri */}
      <Box 
        sx={{ 
          flex: 1.2,
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          bgcolor: '#E6EEF1',
          padding: '0'
        }}
      >
        <Image
          src="/images/7f51d249bb540ced1eb599db92da5fd5.png"
          alt="beije products"
          layout="fill"
          objectFit="cover"
          priority
        />
      </Box>

      {/* Sağ taraf - Login formu */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 2, sm: 4, md: 8 },
        }}
      >
        <Box sx={{ textAlign: 'center', padding: '36px 0' }}>
          <Typography style={{ color: '#000000E5' }} variant="h4" component="h1">
            Merhaba
          </Typography>
          <Typography style={{ color: '#000000E5' }} variant="subtitle1" color="text.secondary">
            beije&apos;e hoş geldin!
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4, mt: 2 }}>
          <Button
            fullWidth
            style={{ border: '1px solid #343131', borderRadius: '30px', padding: '10px 0' }}
            variant="outlined"
            startIcon={
              <Image src="/images/google.svg" alt="Google" width={20} height={20} />
            }
          >
            <Typography style={{ color: '#000000E5' }}>Google ile Giriş Yap</Typography>
          </Button>
          <Button
            fullWidth
            style={{ border: '1px solid #343131', borderRadius: '30px', padding: '10px 0' }}
            variant="outlined"
            startIcon={
              <Image src="/images/facebook.svg" alt="Facebook" width={20} height={20} />
            }
          >
            <Typography style={{ color: '#000000E5' }}>Facebook ile Giriş Yap</Typography>
          </Button>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail adresin"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused': {
                  color: '#000',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#000',
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Şifren"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused': {
                  color: '#000',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#000',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button variant="text" sx={{ textTransform: 'none', color: '#000000E5' }}>
              Şifremi Unuttum
            </Button>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ 
              mt: 3,
              mb: 2,
              color: '#fff',
              bgcolor: '#000',
              '&:hover': {
                bgcolor: '#333'
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              'Giriş Yap'
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const LoginPage = dynamic(() => Promise.resolve(LoginForm), {
  ssr: false
});

export default LoginPage; 