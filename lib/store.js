import { configureStore } from "@reduxjs/toolkit";
import squidSlice from "./squid/squidSlice";

export default configureStore({
    reducer:{
        game: squidSlice
    }
})