import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message.reducer";
import Subject from "../../Apis/Subject.api";
import { RootState } from "../store";
import { setLoading } from "./loading.reducer";
import { UserState } from "./user.reducer";
import { IClass } from "./classes.reducer";
import { ITopic } from "./topic.reducer";
import { message } from "antd";
import { IList } from "./interface";

export const createSubject = createAsyncThunk(
  "subject/createSubject",
  async (body: ISubject, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const data = await Subject.createSubject(body);
      if (data.code) {
        thunkAPI.dispatch(setLoading(false));
        message.error(data.message);
      } else {
        thunkAPI.dispatch(setLoading(false));
        message.success("Tạo môn học thành công");
      }
      return data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getSubjects = createAsyncThunk(
  "subject/getSubjects",
  async ({ limit, teacher, subGroup, sortBy }: any, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const data = await Subject.getSubjects({
        limit,
        teacher,
        subGroup,
        sortBy,
      });
      if (data) {
        thunkAPI.dispatch(setLoading(false));
      }
      return data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const getSubject = createAsyncThunk(
  "subject/getSubject",
  async (id: string, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const data = await Subject.getSubject(id);
      if (data) {
        thunkAPI.dispatch(setLoading(false));
      }
      return data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export interface ISubject {
  id: string;
  key?: number;
  subCode: string;
  subName: string;
  teacher: UserState;
  description: string;
  status: number;
  file: number;
  image: string;
  classes: IClass[];
  topic: ITopic[];
  createdAt: string;
  updatedAt: string;
}

interface SubjectState {
  listSubject: IList;
}

const initialState: SubjectState = {
  listSubject: {
    limit: 0,
    page: 0,
    results: [],
    totalPages: 0,
    totalResults: 0,
  },
};

export const subjectReducer = createSlice({
  name: "subject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createSubject.fulfilled, (state, action) => {
      state.listSubject = action.payload;
    });
    builder.addCase(createSubject.rejected, (state) => {
      state.listSubject = {
        limit: 0,
        page: 0,
        results: [],
        totalPages: 0,
        totalResults: 0,
      };
    });
    builder.addCase(getSubjects.fulfilled, (state, action) => {
      state.listSubject = action.payload;
    });
    builder.addCase(getSubjects.rejected, (state) => {
      state.listSubject = {
        limit: 0,
        page: 0,
        results: [],
        totalPages: 0,
        totalResults: 0,
      };
    });
    builder.addCase(getSubject.fulfilled, (state, action) => {
      state.listSubject = action.payload;
    });
    builder.addCase(getSubject.rejected, (state) => {
      state.listSubject = {
        limit: 0,
        page: 0,
        results: [],
        totalPages: 0,
        totalResults: 0,
      };
    });
  },
});

const { reducer } = subjectReducer;

export const listSubject = (state: RootState) => state.subject.listSubject;

export const totalSubject = (state: RootState) =>
  state.subject.listSubject.totalResults;

export default reducer;
