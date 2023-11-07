import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createRoomAction } from '../redux/actions/roomAction'
import { AutoComplete } from 'antd'
import { getAllUserAction } from '../redux/actions/userAction'
import { ADMIN_ROLE } from '../utils/constant'

const CreateRoom = () => {
	const dispatch = useDispatch()

	const { users } = useSelector((state) => state.userReducer)

	const [roomName, setRoomName] = useState('')

	const [userPk, setUserPk] = useState(null)

	useEffect(() => {
		dispatch(getAllUserAction())
	}, [])

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-4'>
				<span className='text-lg font-semibold'>Room name:</span>
				<input
					value={roomName}
					placeholder='Please Input Room Name'
					onChange={(e) => setRoomName(e.target.value)}
					className='w-full focus:outline-none border-2 border-gray-500 p-2 rounded-md text-lg'
					name='roomName'
					type='text'
				/>
				<AutoComplete
					options={users
						.filter((user) => user.role !== ADMIN_ROLE)
						.map((user) => {
							user.value = user.username
							return user
						})}
					onSelect={(value, option) => {
						setUserPk(option.pk)
					}}
					filterOption={(inputValue, option) =>
						option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
					}>
					<input
						placeholder='Search By Username'
						className='w-full focus:outline-none border-2 border-gray-500 p-2 rounded-md text-lg'
						type='text'
					/>
				</AutoComplete>
			</div>
			<div className='flex justify-end pt-8'>
				<button
					onClick={() => {
						dispatch(createRoomAction({ roomName, userPk }))
					}}
					className='bg-blue-500 text-lg text-white rounded-md py-2 px-4 font-semibold shadow-lg shadow-gray-500'>
					Submit
				</button>
			</div>
		</div>
	)
}

export default CreateRoom
