import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://drf-api-blog.onrender.com"

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000;
        return currentTime > decodedToken.exp;
    } catch {
        return true;
    }
};

// thunks

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, thunkAPI) => {

        try {
            const formData = new FormData();


            formData.append('username', userData.username)
            formData.append('password', userData.password)
            formData.append('first_name', userData.first_name || "")
            formData.append('last_name', userData.last_name || "")
            formData.append('bio', userData.bio || "")
            formData.append('facebook', userData.facebook || "")
            formData.append('youtube', userData.youtube || "")
            formData.append('instagram', userData.instagram || "")
            if (userData.profile_picture) {
                formData.append("profile_picture", userData.profile_picture[0]);
            }
            const res = await fetch(`${BASE_URL}/register_user/`, {
                method: "POST",
                body: formData,
            });


            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData?.detail || "registration failed");
            }
            const data = await res.json()
            return data;

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ username, password }, thunkAPI) => {
        try {
            const res = await fetch(`${BASE_URL}/api/token/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password })
            });


            if (!res.ok) {
                throw new Error('Invalid credentials')
            }
            const data = await res.json();
            localStorage.setItem('accessToken', data.access)
            localStorage.setItem('refreshToken', data.refresh)
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)



export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, thunkAPI) => {
        const refresh = localStorage.getItem('refreshToken')
        if (!refresh) {
            return thunkAPI.rejectWithValue('no refresh token available');
        }
        try {
            const res = await fetch(`${BASE_URL}/api/token_refresh/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh })
            });
            if (!res.ok) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken')
                throw new Error('token refresh failed');
            }
            const data = await res.json()
            localStorage.setItem("accessToken", data.access)
            return data;

        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return thunkAPI.rejectWithValue(error.message)

        }
    }
)

export const checkAuthStatus = createAsyncThunk(
    "auth/checkAuthStatus",
    async (_, thunkApi) => {
        const token = localStorage.getItem("accessToken")
        if (!token) {
            return thunkApi.rejectWithValue("No token Found")
        }

        if (isTokenExpired(token)) {
            const refreshResult = await thunkApi.dispatch(refreshToken());

            if (refreshToken.fulfilled.match(refreshResult)) {
                return { isAuthenticated: true }
            } else {
                return thunkApi.rejectWithValue('token expired and refresh failed')
            }
        }
        return { isAuthenticated: true };
    }
)

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, thunkAPI) => {
        try {
            // Clear tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            // Optional: Call logout endpoint if your API has one
            // await fetch(`${BASE_URL}api/logout/`, { method: 'POST' });

            return {};
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



export const fetchUserByUsername = createAsyncThunk(
    "auth/fetchUserByUsername",
    async (username, thunkAPI) => {
        try {
            const res = await fetch(`${BASE_URL}/user/${username}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
            });

            if (!res.ok) {
                throw new Error('User not found');
            }
            const data = await res.json()
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async (userData, thunkAPI) => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            return thunkAPI.rejectWithValue('no access tokwn')
        }

        try {
            const formData = new FormData();

            formData.append('username', userData.username)
            formData.append('first_name', userData.first_name || "");
            formData.append('last_name', userData.last_name || "");
            formData.append('bio', userData.bio || "");

            formData.append('facebook', userData.facebook || "");
            formData.append('youtube', userData.youtube || "");
            formData.append('instagram', userData.instagram || "");
            if (userData.profile_picture && userData.profile_picture.length > 0) {
                formData.append("profile_picture", userData.profile_picture[0]);
            }


            const res = await fetch(`${BASE_URL}update_userprofile/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            if (!res.ok) {
                if (res.status === 401) {
                    // Try refreshing token
                    const refreshResult = await thunkAPI.dispatch(refreshToken());
                    if (refreshToken.fulfilled.match(refreshResult)) {
                        // Retry with new token
                        const newToken = localStorage.getItem('accessToken');
                        const retryRes = await fetch(`${BASE_URL}update_user_profile/`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${newToken}`,
                            },
                            body: formData,
                        });

                        if (!retryRes.ok) {
                            const errorData = await retryRes.json();
                            throw new Error(errorData?.detail || 'Profile update failed');
                        }

                        const retryData = await retryRes.json();
                        return retryData;
                    }
                }

                const errorData = await res.json();
                throw new Error(errorData?.detail || 'Profile update failed');
            }

            const data = await res.json();
            return data;

        } catch (error) {

            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
//SLICES

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        viewedProfile: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        cleanError: (state) => {
            state.error = null;
        },
        setAuthFromStorage: (state) => {
            const token = localStorage.getItem('accessToken');
            if (token && !isTokenExpired(token)) {
                state.token = token;
                state.isAuthenticated = true;
            } else {
                state.isAuthenticated = false;
            }

        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.access;
                state.isAuthenticated = true;
                state.error = null;

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // refresh token
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                // state.user = action.payload.user;
                state.token = action.payload.access;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            // Check Auth Status
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            // Fetch User by Username
            .addCase(fetchUserByUsername.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserByUsername.fulfilled, (state, action) => {
                state.loading = false;
                // Don't overwrite current user, store as viewed profile
                state.viewedProfile = action.payload;
                state.error = null;
            })
            .addCase(fetchUserByUsername.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.viewedProfile = null;
            })
            // Update User Profile  
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Update current user data
                state.user = action.payload;
                // Also update viewed profile if it's the same user
                if (state.viewedProfile?.username === action.payload.username) {
                    state.viewedProfile = action.payload;
                }
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { cleanError, setAuthFromStorage } = authSlice.actions;

export default authSlice.reducer;