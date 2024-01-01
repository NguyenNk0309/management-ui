import CopyToClipboard from 'react-copy-to-clipboard'
import roomService from '../../services/roomService'
import { ADMIN_ROLE, USER_ID } from '../../utils/constant'
import {
	ASSIGN_STOMP_CLIENT,
	CANCEL_REMIND,
	GET_AMPERE_VOLTAGE_HISTORIES,
	GET_HARDWARE_HISTORIES,
	GET_HARDWARE_LIMIT,
	GET_MY_ROOMS,
	GET_NEW_UPDATED_ROOM_NAME,
	GET_POWER_WATER_HISTORIES,
	SCALE_AMP_VOLT,
} from '../constants/roomConstant'
import { actionOpenModal } from './ModalAction'
import { AiFillCopy } from 'react-icons/ai'
import { closeLoadingAction, openLoadingAction } from './loadingAction'
import { PiWarningCircleFill } from 'react-icons/pi'
import { notification } from 'antd'

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
		dispatch(openLoadingAction())
		try {
			const { status, data } = await roomService.updateHardware(payload)
			if (status === 200) {
			}
		} catch (error) {
			dispatch(openLoadingAction())
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
							<CopyToClipboard
								onCopy={() => {
									notification.open({
										message: <span className='font-semibold'>Warning</span>,
										description: <span>Copy Token Successfully</span>,
										icon: <PiWarningCircleFill className='text-blue-500' />,
										duration: 10,
									})
								}}
								text={data.data}>
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
				alert('Create Room Fail')
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
		} catch (error) {}
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
		} catch (error) {}
		dispatch(closeLoadingAction())
	}
}

export function getAmpereAndVoltageHistoriesAction(payload) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await roomService.getAmpereAndVoltageHistories(payload)
			if (status === 200) {
				dispatch({ type: GET_AMPERE_VOLTAGE_HISTORIES, payload: data.data })
			}
		} catch (error) {}
		dispatch(closeLoadingAction())
	}
}

export function deleteRoomAction(isConnected, payload) {
	return async (dispatch, getState) => {
		const { navigate } = getState().navigateReducer
		dispatch(openLoadingAction())
		try {
			if (isConnected) await dispatch(updateHardwareAction(payload))

			const { status } = await roomService.deleteRoomByPk(payload.pk)
			if (status === 200) {
				alert('Room Delete Successfully')
				navigate('/user/info')
			}
		} catch (error) {
			alert('Room Delete Fail')
		}
		await dispatch(getAllRoomsOfUserAction())
		dispatch(closeLoadingAction())
	}
}

export function getHardwareLimitAction(payload) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await roomService.getHardwareLimit(payload)
			if (status === 200) {
				dispatch({ type: GET_HARDWARE_LIMIT, payload: data.data })
			}
		} catch (error) {}
		dispatch(closeLoadingAction())
	}
}

export function updateHardwareLimitAction(payload) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await roomService.updateHardwareLimit(payload)
			if (status === 200) {
				alert('Limit Update Successfully')
			}
		} catch (error) {
			alert('Limit Update Fail')
		}
		await dispatch(getHardwareLimitAction(payload.roomPk))
		dispatch(closeLoadingAction())
	}
}

export function deleteHardwareLimitAction(payload) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await roomService.deleteHardwareLimit(payload)
			if (status === 200) {
				alert('Limit Delete Successfully')
			}
		} catch (error) {
			alert('Limit Delete Fail')
		}
		await dispatch(getHardwareLimitAction(payload.roomPk))
		dispatch(closeLoadingAction())
	}
}

export function updateRoomNameAction(payload) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await roomService.updateRoomName(payload)
			if (status === 200) {
				alert('Change Name Successfully')
				dispatch({ type: GET_NEW_UPDATED_ROOM_NAME, payload: data.data })
			}
		} catch (error) {
			alert('Change Name Fail')
		}
		await dispatch(getAllRoomsOfUserAction())
		dispatch(closeLoadingAction())
	}
}

export function scaleAmpVoltAction(payload) {
	return {
		type: SCALE_AMP_VOLT,
		payload,
	}
}

export function cancelRemindAction(payload, isEnableTimeout = true) {
	return async (dispatch, getState) => {
		dispatch({ type: CANCEL_REMIND, payload: { sensor: payload.sensor, status: payload.status } })
		if (isEnableTimeout) {
			setTimeout(() => {
				const { stompClient } = getState().roomReducer
				if (stompClient.connected) {
					stompClient.disconnect()
				}
				dispatch({ type: CANCEL_REMIND, payload: { sensor: payload.sensor, status: true } })
			}, payload.time)
		}
	}
}

export function assignStompClientAction(payload) {
	return {
		type: ASSIGN_STOMP_CLIENT,
		payload,
	}
}
