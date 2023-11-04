import userService from '../../services/userService'
import { ROLE, USER_ID } from '../../utils/constant'
import { GET_ALL_USER, GET_MY_INFO } from '../constants/userConstant'
import { closeLoadingAction, openLoadingAction } from './loadingAction'

export function getMyInfoAction() {
	return async (dispatch, getState) => {
		try {
			const { status, data } = await userService.getMyInfo()
			if (status === 200) {
				localStorage.setItem(ROLE, data.data.role)
				localStorage.setItem(USER_ID, data.data.pk)
				dispatch({ type: GET_MY_INFO, payload: data.data })
			}
		} catch (error) {
			alert(error.response?.data.message)
		}
	}
}

export function getAllUserAction() {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await userService.getAllUser()
			if (status === 200) {
				dispatch({ type: GET_ALL_USER, payload: data.data })
			}
		} catch (error) {
			alert(error.response?.data.message)
		}
		dispatch(closeLoadingAction())
	}
}

export function updateUserAction(payload, userPk) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await userService.updateUserInfo(payload, userPk)
			if (status === 200) {
				alert('User Info Update Successfully')
				await dispatch(getAllUserAction())
				await dispatch(getMyInfoAction())
			}
		} catch (error) {
			alert(error.response?.data.message)
		}
		dispatch(closeLoadingAction())
	}
}

export function deleteUserAction(userPk) {
	return async (dispatch, getState) => {
		dispatch(openLoadingAction())
		try {
			const { status, data } = await userService.deleteUser(userPk)
			if (status === 200) {
				await dispatch(getAllUserAction())
				alert('User Delete Successfully')
			}
		} catch (error) {
			alert(error.response?.data.message)
		}
		dispatch(closeLoadingAction())
	}
}
