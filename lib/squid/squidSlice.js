import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  width: 100,
  height: 100,
  borderRadius: "0%",
  backGroundColor: "brown",
  top: 50,
  left: 2,
};

export const squidSlice = createSlice({
  name: "SquidGame",
  initialState,
  reducers: {
    incrementHeight: (state) => {
      if (state.borderRadius === "50%") {
        state.height += 10;
        state.width += 10;
      } else {
        state.height += 10;
      }
    },
    incrementLength: (state) => {
      if (state.borderRadius === "50%") {
        state.height += 10;
        state.width += 10;
      } else {
        state.width += 10;
      }
    },
    changeShape: (state) => {
      if (state.borderRadius === "0%") {
        if (state.height !== state.width) {
          state.height = state.width;
        }
        state.borderRadius = "50%";
      } else {
        state.borderRadius = "0%";
      }
    },
    changePosition: (state, actions)=>{
        const {X, Y} = actions.payload
        state.left = X
        state.top = Y
    },
    resetGame: ()=>{
      return initialState
    }
  },
});

export const { incrementHeight, incrementLength, changeShape, changePosition, resetGame} =
  squidSlice.actions;

export default squidSlice.reducer;
