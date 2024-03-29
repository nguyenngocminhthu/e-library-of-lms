import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { cloneDeep } from "lodash";
import Subject from "../../Apis/Subject.api";
import { RootState } from "../store";
import { IBanks } from "./banks.reducer";
import { IList } from "./interface";
import { setLoading } from "./loading.reducer";
import { setMessage } from "./message.reducer";
import { ISubjectGroup } from "./subjectgroup.reducer";
import { ITopic } from "./topic.reducer";
import { UserState } from "./user.reducer";

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

export const createSubjectByFile = createAsyncThunk(
  "subject/createSubjectByFile",
  async (body: ISubject[], thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const data = await Subject.createSubjectByFile(body);
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

export const updateSubject = createAsyncThunk(
  "subject/updateSubject",
  async ({ id, payload }: any, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const data = await Subject.updateSubject(id, payload);
      if (data.code) {
        thunkAPI.dispatch(setLoading(false));
        message.error(data.message);
      } else {
        thunkAPI.dispatch(setLoading(false));
        message.success("Cập nhật môn học thành công");
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
  async (
    { limit, teacher, subGroup, status, sortBy, year, semester, subName }: any,
    thunkAPI
  ) => {
    try {
      thunkAPI.dispatch(setLoading(true));
      const data = await Subject.getSubjects({
        limit,
        teacher,
        subGroup,
        sortBy,
        status,
        year,
        semester,
        subName,
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
  subGroup: ISubjectGroup;
  teacher: UserState;
  students: string[];
  description: string;
  year: string;
  status: number;
  file: number;
  semester: number;
  image: string;
  topic: ITopic[];
  bank: IBanks[];
  createdAt: string;
  updatedAt: string;
}

interface SubjectState {
  listSubject: IList;
  current?: ISubject;
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
      if (action.payload.code) return state;
      const newState = cloneDeep(state);
      newState.listSubject.results.unshift(action.payload);
      return newState;
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
    builder.addCase(createSubjectByFile.fulfilled, (state, action) => {
      if (action.payload.code) return state;
      const newState = cloneDeep(state);
      newState.listSubject.results.unshift(...action.payload);
      return newState;
    });
    builder.addCase(createSubjectByFile.rejected, (state) => {
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
      state.current = action.payload;
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
    builder.addCase(updateSubject.fulfilled, (state, action) => {
      if (action.payload.code) return state;
      const newState = cloneDeep(state);
      const oldIndex = newState.listSubject.results.findIndex((item: any) => {
        return item.id === action.payload.id;
      });
      newState.listSubject.results.splice(oldIndex, 1, action.payload);
      return newState;
    });
    builder.addCase(updateSubject.rejected, (state, action) => {
      return state;
    });
  },
});

const { reducer } = subjectReducer;

export const listSubject = (state: RootState) => state.subject.listSubject;

export const totalSubject = (state: RootState) =>
  state.subject.listSubject.totalResults;

export default reducer;
