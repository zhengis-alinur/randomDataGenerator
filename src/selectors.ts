import { RootState } from "./redux/store";

export const selectRegion = (state: RootState) => state.table.region;
export const selectErrors = (state: RootState) => state.table.errors;
export const selectSeed = (state: RootState) => state.table.seed;
export const selectData = (state: RootState) => state.table.data;
export const selectCurrentPage = (state: RootState) => state.table.currentPage;