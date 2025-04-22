import axios from 'axios';

const API_BASE_URL = 'https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io';
const VERIFY_PACKET_URL = 'https://3a631b5b-9b1b-4b7f-b736-00d1ce4a1505.mock.pstmn.io';

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await axios.post(`${API_BASE_URL}/sign-in-request`, {
        email,
        password,
      });
      return response.data;
    },
    getProfile: async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          throw new Error('Token bulunamadı');
        }

        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Profil bilgileri alınamadı');
        }

        return {
          success: true,
          data: data
        };
      } catch (error) {
        console.error('Profil bilgileri alınırken hata oluştu:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
        };
      }
    },
  },
  products: {
    getProductsAndPackets: async () => {
      const response = await axios.get(`${API_BASE_URL}/packets-and-products`);
      return response.data;
    },
    verifyPacketPrice: async (token: string, packet: Array<{ _id: string; count: number }>, totalPrice: number) => {
      const response = await axios.post(
        `${VERIFY_PACKET_URL}/verify-packet-price`,
        {
          packet,
          totalPrice,
        },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      return response.data;
    },
  },
}; 