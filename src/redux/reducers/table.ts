import { createSlice } from '@reduxjs/toolkit';
import { Region, User } from '../../types';
import { generateUsers } from '../../utils';
import { PER_PAGE, REGIONS } from '../../constants';

type tableState = {
	region: Region,
	errors: number,
	seed: number,
	data: User[],
	currentPage: number,
}

const initialState: tableState = {
	region: REGIONS.en_US,
	errors: 0,
	seed: 0,
	data: generateUsers({ region: REGIONS.en_US, length: PER_PAGE, seed: 0 }),
	currentPage: 0,
}

const tableSlice = createSlice({
	name: 'table',
	initialState,
	reducers: {
		setRegion: (state, action) => {
			state.region = action.payload
		},
		setErrors: (state, action) => {
			state.errors = action.payload
		},
		setSeed: (state, action) => {
			state.seed = action.payload
		},
		setData: (state, action) => {
			state.data = action.payload
		},
		updateData: (state, { payload }) => {
			state.data = [...state.data.slice(0, -10), ...payload]
		},
		incrementPage: (state) => {
			state.currentPage = state.currentPage + 1;
		},
	}
})

export const { setRegion, setErrors, setSeed, setData, updateData, incrementPage } = tableSlice.actions;
export default tableSlice.reducer;