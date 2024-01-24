import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: UserState;
};

type UserState = {
  username: string;
  isModerator: boolean;
};

const initialState = {
  value: {
    username: "sushant",
    isModerator: true,
  },
} as InitialState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clear: (state) => {
      return {
        value: {
          username: "",
          isModerator: false,
        },
      };
    },
    add: (state, action: PayloadAction<string>) => {
      return {
        value: {
          username: action.payload,
          isModerator: true,
        },
      };
    },
  },
});

export const { clear, add } = userSlice.actions;
export default userSlice.reducer;
