import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the state interface
interface ConfigState {
  systemConfig: { [key: string]: any } | null;
  businessConfig: { [key: string]: any } | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ConfigState = {
  systemConfig: null,
  businessConfig: null,
  loading: false,
  error: null,
};
    
// Async Thunks for fetching configurations
export const fetchSystemConfig = createAsyncThunk(
  'config/fetchSystemConfig',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/config/all?type=system`
    );
    if (!response.data.success) {
      throw new Error(
        response.data.message || 'Failed to fetch system configuration'
      );
    }
    return response.data.data.config;
  }
);

export const fetchBusinessConfig = createAsyncThunk(
  'config/fetchBusinessConfig',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/config/all?type=business`
    );
    if (!response.data.success) {
      throw new Error(
        response.data.message || 'Failed to fetch business configuration'
      );
    }
    return response.data.data.config;
  }
);

// Async Thunk for updating system configuration
export const updateSystemConfig = createAsyncThunk(
  'config/updateSystemConfig',
  async (updatedConfig: any, { dispatch, rejectWithValue }) => {
    try {
      const { type, ...fieldsToUpdate } = updatedConfig;
      const flattenedConfig = flattenObject(fieldsToUpdate);
      console.log(flattenedConfig); 
     
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/config?type=system`, 
        flattenedConfig 
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update system configuration");
      }

      dispatch(fetchSystemConfig());
    } catch (error) {
      return rejectWithValue("Failed to update configuration.");
    }
  }
);

const flattenObject = (obj: any, prefix: string = ''): any => {
    let result: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(result, flattenObject(obj[key], newKey));  // Recursively flatten
        } else {
          result[newKey] = obj[key];  // Assign value if it's not an object
        }
      }
    }
    
    return result;
  };

// Async Thunk for updating business configuration
export const updateBusinessConfig = createAsyncThunk(
  "config/updateBusinessConfig",
  async (updatedConfig: any, { dispatch, rejectWithValue }) => {
    try {
      const { type, ...fieldsToUpdate } = updatedConfig;
      const flattenedConfig = flattenObject(fieldsToUpdate);
      console.log(flattenedConfig); 
     
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/config?type=business`, 
        flattenedConfig 
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update system configuration");
      }

      dispatch(fetchBusinessConfig());
    } catch (error) {
      return rejectWithValue("Failed to update configuration.");
    }
  }
);

// Create slice
const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch System Config
      .addCase(fetchSystemConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemConfig.fulfilled, (state, action: PayloadAction<{ [key: string]: any }>) => {
        state.systemConfig = action.payload;
        state.loading = false;
      })
      .addCase(fetchSystemConfig.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch system config';
        state.loading = false;
      })

      // Fetch Business Config
      .addCase(fetchBusinessConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessConfig.fulfilled, (state, action: PayloadAction<{ [key: string]: any }>) => {
        state.businessConfig = action.payload;
        state.loading = false;
      })
      .addCase(fetchBusinessConfig.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch business config';
        state.loading = false;
      })

      // Update System Config
      .addCase(updateSystemConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(updateSystemConfig.fulfilled, (state, action: PayloadAction<{ [key: string]: any }>) => {
      //   state.systemConfig = action.payload; // Update system config in the state
      //   state.loading = false;
      // })
      .addCase(updateSystemConfig.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update system config';
        state.loading = false;
      })

      // Update Business Config
      .addCase(updateBusinessConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(updateBusinessConfig.fulfilled, (state, action: PayloadAction<{ [key: string]: any }>) => {
      //   state.businessConfig = action.payload;
      //   state.loading = false;
      // })
      .addCase(updateBusinessConfig.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update business config';
        state.loading = false;
      });
  },
});

export default configSlice.reducer;
