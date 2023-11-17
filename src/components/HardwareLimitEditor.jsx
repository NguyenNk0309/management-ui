import { InputNumber } from 'antd'
import React, { useState } from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { useDispatch } from 'react-redux'
import { deleteHardwareLimitAction, updateHardwareLimitAction } from '../redux/actions/roomAction'

const HardwareLimitEditor = ({ hardwareLimit, roomPk, hardwareId }) => {
	const dispatch = useDispatch()

	const [limitInfo, setLimitInfo] = useState({
		hardwareId: hardwareId,
		upperLimit: hardwareLimit?.upperLimit,
		lowerLimit: hardwareLimit?.lowerLimit,
	})

	return (
		<div className='flex flex-col gap-2'>
			<div className='flex items-center gap-2'>
				<span>Upper Limit:</span>
				<InputNumber
					value={limitInfo.upperLimit}
					onChange={(e) => setLimitInfo({ ...limitInfo, upperLimit: e })}
				/>
				<IoIosCloseCircleOutline
					onClick={() => setLimitInfo({ ...limitInfo, upperLimit: null })}
					className='text-red-500 text-2xl cursor-pointer'
				/>
			</div>
			<div className='flex items-center gap-2'>
				<span>Lower Limit:</span>
				<InputNumber
					value={limitInfo.lowerLimit}
					onChange={(e) => setLimitInfo({ ...limitInfo, lowerLimit: e })}
				/>
				<IoIosCloseCircleOutline
					onClick={() => setLimitInfo({ ...limitInfo, lowerLimit: null })}
					className='text-red-500 text-2xl cursor-pointer'
				/>
			</div>

			<div className='flex items-center justify-end gap-2'>
				<button
					onClick={() => {
						if (window.confirm('Are You Sure To These Limit Setup ?') === true) {
							setLimitInfo({ ...limitInfo, upperLimit: null, lowerLimit: null })
							dispatch(deleteHardwareLimitAction({ roomPk, hardwareId }))
						}
					}}
					disabled={limitInfo.lowerLimit == null && limitInfo.upperLimit == null}
					className={`px-2 py-1 rounded-lg bg-red-500 font-semibold text-white shadow-lg shadow-gray-400 ${
						limitInfo.lowerLimit == null && limitInfo.upperLimit == null
							? 'disabled:cursor-not-allowed'
							: ''
					}`}>
					Clear
				</button>
				<button
					onClick={() => dispatch(updateHardwareLimitAction({ roomPk, data: limitInfo }))}
					className='px-2 py-1 rounded-lg bg-blue-500 font-semibold text-white shadow-lg shadow-gray-400'>
					Update
				</button>
			</div>
		</div>
	)
}

export default HardwareLimitEditor
