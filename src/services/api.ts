import axios from 'axios';

const API_BASE_URL = 'https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io';
const VERIFY_PACKET_URL = 'https://3a631b5b-9b1b-4b7f-b736-00d1ce4a1505.mock.pstmn.io';

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/sign-in-request`, {
          email,
          password,
        });
        
        if (response.data && response.data.success) {
          return response.data;
        }
        
        throw new Error('Login failed');
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    getProfile: async (token: string) => {
      try {
        // Mock profile data
        const mockProfile = {
          success: true,
          data: {
            _id: "1",
            profileInfo: {
              firstName: "Test",
              lastName: "User",
              birthDate: "1990-01-01",
              email: "test@example.com",
              passwordHash: "hashed_password"
            }
          }
        };
        return mockProfile;
      } catch (error) {
        console.error('Profile error:', error);
        throw error;
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