import CopyToClipboard from 'react-copy-to-clipboard'
import roomService from '../../services/roomService'
import { ADMIN_ROLE, USER_ID } from '../../utils/constant'
import { GET_HARDWARE_HISTORIES, GET_MY_ROOMS, GET_POWER_WATER_HISTORIES } from '../constants/roomConstant'
import { actionOpenModal } from './ModalAction'
import { AiFillCopy } from 'react-icons/ai'
import { closeLoadingAction, openLoadingAction } from './loadingAction'

export function getAllRoomsOfUserAction() {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			let response
			if (localStorage.getItem('ROLE') === ADMIN_ROLE) {
				response = await roomService.getAllRooms()
			} else {
				response = await roomService.getAllRoomsOfUser(localStorage.getItem(USER_ID))
			}

			if (response.status === 200) {
				dispatch({ type: GET_MY_ROOMS, payload: response.data.data })
			}
		} catch (error) {}
		dispatch(closeLoadingAction())
	}
}

export function updateHardwareAction(payload) {
	return async (dispatch, getState) => {
		try {
			const { status, data } = await roomService.updateHardware(payload)
			if (status === 200) {
				// dispatch({ type: GET_MY_ROOMS, payload: data.data })
			}
		} catch (error) {
			alert(error.response?.data.message)
		}
	}
}

export function createRoomAction(payload) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		if (payload.roomName.trim() === '' || payload.userPk === null) {
			alert('Please Input Room Name And Select User')
		} else {
			try {
				const { status, data } = await roomService.createRoom(payload)
				if (status === 200) {
					dispatch(
						actionOpenModal(
							'Room Register Token',
							<CopyToClipboard text={data.data}>
								<div className='flex items-center gap-6 justify-center text-violet-500 font-semibold text-2xl cursor-pointer'>
									<span className=''>{data.data}</span>
									<AiFillCopy className='' />
								</div>
							</CopyToClipboard>
						)
					)
					dispatch(getAllRoomsOfUserAction())
				}
			} catch (error) {
				alert(error.response?.data.message)
			}
		}
		dispatch(closeLoadingAction())
	}
}
export function getHardwareUpdateHistories(payload) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await roomService.getHardwareUpdateHistories(payload)
			if (status === 200) {
				dispatch({ type: GET_HARDWARE_HISTORIES, payload: data.data })
			}
		} catch (error) {
			alert(error.response?.data.message)
		}
		dispatch(closeLoadingAction())
	}
}

export function getPowerAndWaterConsumptionHistoriesAction(payload) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await roomService.getPowerAndWaterConsumptionHistories(payload)
			if (status === 200) {
				dispatch({ type: GET_POWER_WATER_HISTORIES, payload: data.data })
			}
		} catch (error) {
			alert(error.response?.data.message)
		}
		dispatch(closeLoadingAction())
	}
}
