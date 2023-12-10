import {
	GET_AMPERE_VOLTAGE_HISTORIES,
	GET_HARDWARE_HISTORIES,
	GET_HARDWARE_LIMIT,
	GET_MY_ROOMS,
	GET_NEW_UPDATED_ROOM_NAME,
	GET_POWER_WATER_HISTORIES,
	SCALE_AMP_VOLT,
} from '../constants/roomConstant'

const initialState = {
	myRooms: {},
	hardwareHistories: [],
	powerAndWaterHistories: [],
	ampereVoltageHistories: [],
	ampereVoltageHistoriesClone: [],
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
			newState.ampereVoltageHistoriesClone = payload
			return newState
		}
		case SCALE_AMP_VOLT: {
			const newLength0 = (payload[0] * newState.ampereVoltageHistoriesClone.length) / 100
			const newLength1 = (payload[1] * newState.ampereVoltageHistoriesClone.length) / 100
			newState.ampereVoltageHistories = newState.ampereVoltageHistoriesClone.slice(
				Math.round(newLength0),
				Math.round(newLength1)
			)
			return newState
		}
		default:
			return state
	}
}
