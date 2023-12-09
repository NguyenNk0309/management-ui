import {
	GET_AMPERE_VOLTAGE_HISTORIES,
	GET_HARDWARE_HISTORIES,
	GET_HARDWARE_LIMIT,
	GET_MY_ROOMS,
	GET_NEW_UPDATED_ROOM_NAME,
	GET_POWER_WATER_HISTORIES,
} from '../constants/roomConstant'

const initialState = {
	myRooms: {},
	hardwareHistories: [],
	powerAndWaterHistories: [],
	ampereVoltageHistories: [],
	hardwareLimit: [],
	roomName: '',
}

export default function roomReducer(state = initialState, { type, payload }) {
	const newState = { ...state }
	switch (type) {
		case GET_MY_ROOMS: {
			newState.myRooms = payload
			return newState
		}
		case GET_HARDWARE_HISTORIES: {
			newState.hardwareHistories = payload
			return newState
		}
		case GET_POWER_WATER_HISTORIES: {
			newState.powerAndWaterHistories = payload
			return newState
		}
		case GET_HARDWARE_LIMIT: {
			newState.hardwareLimit = payload
			return newState
		}
		case GET_NEW_UPDATED_ROOM_NAME: {
			newState.roomName = payload
			return newState
		}
		case GET_AMPERE_VOLTAGE_HISTORIES: {
			newState.ampereVoltageHistories = payload
			return newState
		}
		default:
			return state
	}
}
