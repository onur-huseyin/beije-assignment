import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface Packet {
  _id: string;
  title: string;
  image: string;
}

interface ProductsState {
  products: Product[];
  packets: Packet[];
  selectedProducts: {
    [key: string]: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  packets: [],
  selectedProducts: {},
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setPackets: (state, action: PayloadAction<Packet[]>) => {
      state.packets = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<{ id: string; count: number }>) => {
      const { id, count } = action.payload;
      if (count === 0) {
        delete state.selectedProducts[id];
      } else {
        state.selectedProducts[id] = count;
      }
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setPackets,
  setSelectedProduct,
  clearSelectedProducts,
  setLoading,
  setError,
} = productsSlice.actions;
export default productsSlice.reducer; 