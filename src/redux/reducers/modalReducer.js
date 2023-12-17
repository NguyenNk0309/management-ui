import { CLOSE_MODAL, OPEN_MODAL } from '../constants/modalConstant'

const initialState = {
	isOpen: false,
	title: '',
	Content: () => null,
	isDefaultWidth: true,
}

export default function modalReducer(state = initialState, { type, payload }) {
	const newState = { ...state }
	switch (type) {
		case OPEN_MODAL: {
			const { title, Component, isDefaultWidth } = payload
			newState.isOpen = true
			newState.title = title
			newState.Content = () => Component
			newState.isDefaultWidth = isDefaultWidth
			return newState
		}
		case CLOSE_MODAL: {
			newState.isOpen = false
			return newState
		}
		default:
			return state
	}
}
