import { Modal } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actionCloseModal } from '../redux/actions/ModalAction'

const ModalBase = () => {
	const dispatch = useDispatch()
	const { isOpen, Content, title, isDefaultWidth } = useSelector((state) => state.modalReducer)

	return (
		<>
			<Modal
				width={isDefaultWidth ? '80%' : null}
				centered={true}
				footer={null}
				zIndex={10}
				title={title}
				open={isOpen}
				onCancel={() => dispatch(actionCloseModal())}>
				<Content />
			</Modal>
		</>
	)
}

export default ModalBase
