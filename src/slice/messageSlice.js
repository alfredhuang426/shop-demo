import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "message",
  initialState: [
    {
      id: new Date().getTime(),
      type: "success",
      title: "更新標題",
      text: "更新成功",
    },
    {
      id: new Date().getTime()+1,
      type: "success",
      title: "更新標題",
      text: "更新成功",
    },
  ],
});

export default messageSlice.reducer;
