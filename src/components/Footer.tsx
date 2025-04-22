'use client';

import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Image from 'next/image';

const WaveContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '80px',
  overflow: 'hidden',
  marginTop: '-120px',
});

const Wave = styled('svg')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
});

const FooterContainer = styled(Box)({
  backgroundColor: '#262626',
  color: '#fff',
  position: 'relative',
});

const FooterContent = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  padding: '48px 24px',
});

const NewsletterSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const NewsletterForm = styled(Box)({
  display: 'flex',
  gap: '8px',
  maxWidth: '500px',
});

const StyledInput = styled(TextField)({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#262626',
    color: '#fff',
    borderRadius: '4px',
    '& fieldset': {
      borderColor: '#FFFFFF3B',
    },
    '&:hover fieldset': {
      borderColor: '#FFFFFF3B',
    },
  },
  '& .MuiOutlinedInput-input': {
    '&::placeholder': {
      color: '#fff',
      opacity: 1,
    },
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: '#fff',
  color: '#1C1C1C',
  padding: '14px 24px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: '#f6f2ed',
  },
});

const LinksSection = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '24px',
});

const LinkColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const FooterLink = styled(Link)({
  color: '#fff',
  textDecoration: 'none',
  fontSize: '14px',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const BottomSection = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  paddingTop: '24px',
  marginTop: '24px',
  flexWrap: 'wrap',
  gap: '16px',
});

const PaymentMethods = styled(Box)({
  display: 'flex',
  gap: '8px',
});

export default function Footer() {
  return (
    <>
      <WaveContainer>
        <Wave
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="#262626"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,160L26.7,165.3C53.3,171,107,181,160,181.3C213.3,181,267,171,320,181.3C373.3,192,427,224,480,229.3C533.3,235,587,213,640,197.3C693.3,181,747,171,800,181.3C853.3,192,907,224,960,213.3C1013.3,203,1067,149,1120,144C1173.3,139,1227,181,1280,192C1333.3,203,1387,181,1413,170.7L1440,160L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
          />
        </Wave>
      </WaveContainer>
      <FooterContainer>
        <FooterContent>
          <NewsletterSection>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Arayı açmayalım!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              beije&apos;nin ürünlerini ve hizmetlerini kullanarak, beije&apos;nin Kullanıcı Sözleşmesi&apos;ni ve Gizlilik Politikası&apos;nı kabul etmiş olursunuz.
            </Typography>
            <NewsletterForm>
              <StyledInput placeholder="E-mail Adresin" fullWidth />
              <SubmitButton>Gönder</SubmitButton>
            </NewsletterForm>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Abone olarak, beije KVKK ve Gizlilik Politikası'nı kabul ediyor ve beije'den haber almayı onaylıyorum.
            </Typography>
          </NewsletterSection>

          <LinksSection>
            <LinkColumn>
              <FooterLink href="/beije-ped">beije Ped</FooterLink>
              <FooterLink href="/beije-gunluk-ped">beije Günlük Ped</FooterLink>
              <FooterLink href="/beije-tampon">beije Tampon</FooterLink>
            </LinkColumn>
            <LinkColumn>
              <FooterLink href="/biz-kimiz">Biz Kimiz?</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/sikca-sorulan-sorular">Sıkça Sorulan Sorular</FooterLink>
              <FooterLink href="/ekibimize-katil">Ekibimize Katıl</FooterLink>
            </LinkColumn>
            <LinkColumn>
              <FooterLink href="https://facebook.com/beije" target="_blank">Facebook</FooterLink>
              <FooterLink href="https://instagram.com/beije" target="_blank">Instagram</FooterLink>
              <FooterLink href="https://twitter.com/beije" target="_blank">Twitter</FooterLink>
              <FooterLink href="https://linkedin.com/company/beije" target="_blank">LinkedIn</FooterLink>
              <FooterLink href="https://spotify.com/beije" target="_blank">Spotify</FooterLink>
            </LinkColumn>
          </LinksSection>

          <BottomSection>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FooterLink href="/kvkk">KVKK</FooterLink>
              <FooterLink href="/kvkk-basvuru-formu">KVKK Başvuru Formu</FooterLink>
              <FooterLink href="/uyelik-sozlesmesi">Üyelik Sözleşmesi</FooterLink>
              <FooterLink href="/gizlilik-politikasi">Gizlilik Politikası</FooterLink>
              <FooterLink href="/cerez-politikasi">Çerez Politikası</FooterLink>
              <FooterLink href="/test-sonuclari">Test Sonuçları</FooterLink>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                2022 beije. Tüm hakları saklıdır.
              </Typography>
              <Box component="span" sx={{ mx: 1 }}>|</Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>EN</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>TR</Typography>
              </Box>
            </Box>
            <PaymentMethods>
              <Image src="/images/master.png" alt="Mastercard" width={24} height={24} />
              <Image src="/images/visa.png" alt="Visa" width={24} height={24} />
            </PaymentMethods>
          </BottomSection>
        </FooterContent>
      </FooterContainer>
    </>
  );
} 