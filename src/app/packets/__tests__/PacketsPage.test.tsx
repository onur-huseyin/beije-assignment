import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import PacketsPage from '../page';

// Mock API calls
jest.mock('../../../services/api', () => ({
  products: {
    getProductsAndPackets: jest.fn().mockResolvedValue({
      success: true,
      data: {
        products: [
          {
            _id: '1',
            title: 'Test Ürün',
            type: 'Menstrual',
            image: 'test.jpg',
            subProducts: [
              { _id: 'sub1', name: 'Test Alt Ürün', price: 50 }
            ]
          }
        ],
        packets: []
      }
    }),
    verifyPacketPrice: jest.fn().mockResolvedValue({ success: true })
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn()
  })
}));

describe('PacketsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'test-token';
      if (key === 'selectedProducts') return '{}';
      return null;
    });
  });

  it('renders loading state initially', async () => {
    render(
      <Provider store={store}>
        <PacketsPage />
      </Provider>
    );
    
    // Skeleton yükleme durumunu kontrol et
    const loadingElements = screen.getAllByRole('progressbar');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders products after loading', async () => {
    render(
      <Provider store={store}>
        <PacketsPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Ürün')).toBeInTheDocument();
    });
  });

  it('handles product selection', async () => {
    render(
      <Provider store={store}>
        <PacketsPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Ürün')).toBeInTheDocument();
    });

    // Expand butonunu bul ve tıkla
    const expandButtons = screen.getAllByTestId('ExpandMoreIcon');
    fireEvent.click(expandButtons[0]);

    // Miktar artırma butonunu bul ve tıkla
    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton);

    // Miktarın güncellendiğini kontrol et
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calculates total price correctly', async () => {
    render(
      <Provider store={store}>
        <PacketsPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Ürün')).toBeInTheDocument();
    });

    // Expand butonunu bul ve tıkla
    const expandButtons = screen.getAllByTestId('ExpandMoreIcon');
    fireEvent.click(expandButtons[0]);

    // Miktar artırma butonunu bul ve tıkla
    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton);

    // Toplam fiyatı kontrol et
    expect(screen.getByText('Sepete Ekle (50₺)')).toBeInTheDocument();
  });
}); 