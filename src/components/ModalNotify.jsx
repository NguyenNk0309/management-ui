import { Select } from 'antd'
import React, { useState } from 'react'
import warning from '../assets/imgs/Blinking_warning.gif'
import { useDispatch } from 'react-redux'
import { FIRE } from '../utils/constant'
import { actionCloseModal } from '../redux/actions/ModalAction'
import { cancelRemindAction } from '../redux/actions/roomAction'

const ModalNotify = ({ sensor, roomName, stompClient }) => {
	const dispatch = useDispatch()

	const [timeRemind, setTimeRemind] = useState(60000)

	return (
		<div className='flex flex-col justify-center items-center gap-5'>
			<img className='h-[300px] w-[300px]' src={warning} alt='' />
			<h1 className='text-red-600 font-semibold text-4xl'>
				{sensor === FIRE ? 'Fire' : 'Gas'} Detected In{' '}
				{<span className='text-orange-600 font-semibold text-4xl underline'>{roomName}</span>}
				!!!
			</h1>
			<h1 className='text-red-600 font-semibold text-3xl'>Please Evacuate The Area Immediately</h1>
			<div className='flex gap-2 font-semibold text-lg items-center justify-end'>
				<h1>Remind After:</h1>
				<Select
					defaultValue='1 Minute'
					style={{
						width: 120,
					}}
					onChange={(value) => {
						setTimeRemind(value)
					}}
					options={[
						{
							value: 60000,
							label: '1 Minute',
						},
						{
							value: 900000,
							label: '15 Minutes',
						},
						{
							value: 1800000,
							label: '30 Minutes',
						},
						{
							value: 3600000,
							label: '1 Hour',
						},
					]}
				/>
				<button
					onClick={() => {
						if (stompClient.connected) {
							stompClient.disconnect()
						}
						dispatch(cancelRemindAction({ sensor, status: false, time: timeRemind }))
						dispatch(actionCloseModal())
					}}
					className='px-2 py-1 rounded-md bg-green-500 text-white'>
					Submit
				</button>
			</div>
		</div>
	)
}

export default ModalNotify
