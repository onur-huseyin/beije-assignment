import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  _id: string;
  profileInfo: {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    passwordHash: string;
  };
}

interface AuthState {
  token: string | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  profile: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.profile = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setToken, setProfile, logout } = authSlice.actions;
export default authSlice.reducer; 