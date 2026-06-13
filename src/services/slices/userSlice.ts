import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  updateUserError: null
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserMessages: (state) => {
      state.error = null;
      state.updateUserError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ой, произошла ошибка!';
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ой, произошла ошибка!';
        state.isAuthChecked = true;
      })

      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
        state.updateUserError = 'Ой, произошла ошибка!';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = null;
        state.updateUserError = null;
      });
  }
});

export const { clearUserMessages } = userSlice.actions;
export const userReducer = userSlice.reducer;
