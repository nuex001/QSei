import { configureStore } from "@reduxjs/toolkit";
import TxCountReducer from "./TxCount";
export default configureStore({
  reducer: {
    TxCount: TxCountReducer,
  },
});
