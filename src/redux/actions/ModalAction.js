import { CLOSE_MODAL, OPEN_MODAL } from '../constants/modalConstant'

export function actionOpenModal(title, Component, isDefaultWidth = true) {
	return {
		type: OPEN_MODAL,
		payload: { title, Component, isDefaultWidth },
	}
}

export function actionCloseModal() {
	return {
		type: CLOSE_MODAL,
	}
}
