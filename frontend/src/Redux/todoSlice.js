import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance"; // ✅ Short & Clean import

// 📌 Fetch Todos
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, thunkAPI) => {
  try {
    const response = await api.get("/api/users/task/getalltask");
    return response.data.task || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch todos");
  }
});

// 📌 Add Todo
export const addTodo = createAsyncThunk("todo/addTodo", async (todo, thunkAPI) => {
  try {
    const response = await api.post("/api/users/task/newtask", todo);
    thunkAPI.dispatch(fetchTodos());  
    return response.data.task;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to add todo");
  }
});

// 📌 Delete Todo
export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id, thunkAPI) => {
  try {
    await api.delete(`/api/users/task/deletetask/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete todo");
  }
});

// 📌 Update Todo
export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ taskId, updatedTodo }, thunkAPI) => {
  try {
    const response = await api.put(`/api/users/task/updatetask/${taskId}`, updatedTodo);
    thunkAPI.dispatch(fetchTodos());
    return response.data.task;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to update todo");
  }
});

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todo: [],
    marked: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => { state.loading = true; })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todo = action.payload.filter((task) => !task.taskstatus);
        state.marked = action.payload.filter((task) => task.taskstatus);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addTodo.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addTodo.fulfilled, (state, action) => { state.todo.push(action.payload); state.loading = false; })
      .addCase(addTodo.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deleteTodo.pending, (state) => { state.loading = true; })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todo = state.todo.filter((task) => task._id !== action.payload);
        state.marked = state.marked.filter((task) => task._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTodo.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateTodo.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        if (updatedTask.taskstatus) {
          state.marked.push(updatedTask);
          state.todo = state.todo.filter((task) => task._id !== updatedTask._id);
        } else {
          state.todo.push(updatedTask);
          state.marked = state.marked.filter((task) => task._id !== updatedTask._id);
        }
      });
  }
});

export default todoSlice.reducer;
