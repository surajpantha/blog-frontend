import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = String(import.meta.env.VITE_BASE_URL)


// thunks
export const createPost = createAsyncThunk(
  "crud/createPost",
  async (postData, thunkAPI) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      const formData = new FormData();
      formData.append('title', postData.title)
      formData.append('content', postData.content)
      formData.append('is_draft', postData.is_draft|| false)
      formData.append('category', postData.category)
      if (postData.featured_image && postData.featured_image.length > 0) {

        formData.append("featured_image", postData.featured_image[0]);

      }
      const res = await fetch(`${BASE_URL}/create_blog/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formData
      });
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData?.detail || "couldn't create your post")
      }
      const data = await res.json()
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);

    }
  }
)


export const getBlogList = createAsyncThunk(
  'crud/getBlogList',
  async (thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/blog_list/`, {
        method: 'GET'
      });

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData?.detail || "couldn't fetch the blogs");
      }

      const data = await res.json()
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)




export const updateBlog = createAsyncThunk(
  "crud/updateBlog",
  async ({ id ,postData}, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('title', postData.title)
      formData.append('content', postData.content)
      formData.append('is_draft', postData.is_draft || false)
      formData.append('category', postData.category)
      // console.log("postData:", postData);
      if (postData.featured_image) {
        formData.append("featured_image", postData.featured_image[0]);
      }
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${BASE_URL}/update_blog/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        throw new Error("failed to update blog")
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);

    }
  }
)


export const deleteBlog = createAsyncThunk(
  "crud/deleteBlog",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${BASE_URL}/delete_blog/${id}/`, {

        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error("couldn't delethe the blog")
      }
      const data = await res.json()
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)

    }
  }
)


// SLICES

const initialState = {
  blogs: [],
  loading: false,
  error: null,
  successMessage: null,
};

const crudSlice = createSlice({
  name: "crud",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET BLOGS
      .addCase(getBlogList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogList.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(getBlogList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE BLOG
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload); // Add new blog to top
        state.successMessage = "Blog created successfully";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE BLOG
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        state.successMessage = "Blog updated successfully";
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE BLOG
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.blogs = state.blogs.filter((b) => b.id !== deletedId);
        state.successMessage = "Blog deleted successfully";
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = crudSlice.actions;

export default crudSlice.reducer;