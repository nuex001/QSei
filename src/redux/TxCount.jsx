import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

// initializing state
const initialState = {
  loading: false,
  user: null,
  tasks: null,
  refs: null,
  topUsers: null,
  quiz: null,
  Userpoint: 0,
  Referrer: null,
  error: null,
  success: null,
};

// Generates async functions
// https://backend.propertiesyard.com

export const logorsign = createAsyncThunk(
  "TxCount/logorsign",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/`,
        form
      );
      sessionStorage.setItem("token", response.data.jwt);
      sessionStorage.setItem("role", response.data.role);
      sessionStorage.setItem("myId", response.data.myId);
      setAuthToken(response.data.jwt);
      // console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.err);
    }
  }
);

// Get User
export const getUser = createAsyncThunk(
  "TxCount/getUser",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/`
      );
      return response.data; // data is the last
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Get User
export const getTopUsers = createAsyncThunk(
  "TxCount/getTopUsers",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/top`
      );
      // console.log(response.data);
      return response.data; // data is the last
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
// FETCH TASKS
export const fetchRefs = createAsyncThunk(
  "TxCount/fetchRefs",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/referred/`
      );
      console.log(response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// FETCH TASKS
export const fetchTasks = createAsyncThunk(
  "TxCount/fetchTasks",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// CLAIM TASK
export const claimTask = createAsyncThunk(
  "TxCount/claimTask",
  async ({ taskId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/task/${taskId}`,
        {
          userId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// CREATE TASK
export const createQuiz = createAsyncThunk(
  "TxCount/createQuiz",
  async (form, { rejectWithValue }) => {
    console.log(form);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/quiz`,
        form
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// fetchQuiz
export const fetchQuiz = createAsyncThunk(
  "TxCount/fetchQuiz",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/quiz`
      );

      return response.data[0];
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//updateQuiz
export const updateQuiz = createAsyncThunk(
  "TxCount/updateQuiz",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/quiz`,
        form
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// REDUCERS
const TxCountSlice = createSlice({
  name: "TxCount",
  initialState,
  reducers: {
    clear(state) {
      return {
        ...state,
        success: null,
        error: null,
      };
    },
    addReferer(state, action) {
      return {
        ...state,
        Referrer: action.payload,
      };
    },
  },
  // working for async fetching data
  extraReducers: (builder) => {
    // WORKING FOR Register -> LOGIN
    builder.addCase(logorsign.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logorsign.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.Userpoint = action.payload.user.point;
      state.error = null;
    });
    builder.addCase(logorsign.rejected, (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    });

    // WORKING FOR GET User
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      const tap = localStorage.getItem(`${action.payload?.username}_tap`);
      state.loading = false;
      state.user = action.payload;
      state.Userpoint = tap
        ? action.payload.point + Number(tap)
        : action.payload.point;
      state.error = null;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    });

    // WORKING FOR GET REFERRALS
    builder.addCase(getTopUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTopUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.topUsers = action.payload;
      state.error = null;
    });
    builder.addCase(getTopUsers.rejected, (state, action) => {
      state.loading = false;
      state.topUsers = null;
      state.error = action.payload;
    });
    // WORKING FOR GET REFERRALS
    builder.addCase(fetchRefs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRefs.fulfilled, (state, action) => {
      state.loading = false;
      state.refs = action.payload;
      state.error = null;
    });
    builder.addCase(fetchRefs.rejected, (state, action) => {
      state.loading = false;
      state.refs = null;
      state.error = action.payload;
    });
    // FETCH TASK
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    });

    // CLAIM TASK
    builder.addCase(claimTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(claimTask.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.msg;
      state.error = null;
    });
    builder.addCase(claimTask.rejected, (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    });

    // CREATE TASK
    builder.addCase(createQuiz.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.msg;
      state.error = null;
    });
    builder.addCase(createQuiz.rejected, (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    });

    // EQUIP TOOLS
    builder.addCase(fetchQuiz.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchQuiz.fulfilled, (state, action) => {
      state.loading = false;
      state.quiz = action.payload;
      state.error = null;
    });
    builder.addCase(fetchQuiz.rejected, (state, action) => {
      state.loading = false;
      state.quiz = null;
      state.error = action.payload;
    });

    // updateQuiz
    builder.addCase(updateQuiz.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateQuiz.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.msg;
      state.error = null;
    });
    builder.addCase(updateQuiz.rejected, (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload.err;
    });
  },
});
export const { clear, addReferer } = TxCountSlice.actions;
export default TxCountSlice.reducer;
