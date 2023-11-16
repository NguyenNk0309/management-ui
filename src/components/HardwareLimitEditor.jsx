import { InputNumber } from 'antd'
import React, { useState } from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io'

const HardwareLimitEditor = ({ hardwareLimit }) => {
	const [limitInfo, setLimitInfo] = useState({
		hardwareId: hardwareLimit?.hardwareId,
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
					disabled={limitInfo.lowerLimit == null && limitInfo.upperLimit == null}
					className={`px-2 py-1 rounded-lg bg-red-500 font-semibold text-white shadow-lg shadow-gray-400 ${
						limitInfo.lowerLimit == null && limitInfo.upperLimit == null
							? 'disabled:cursor-not-allowed'
							: ''
					}`}>
					Clear
				</button>
				<button className='px-2 py-1 rounded-lg bg-blue-500 font-semibold text-white shadow-lg shadow-gray-400'>
					Update
				</button>
			</div>
		</div>
	)
}

export default HardwareLimitEditor
