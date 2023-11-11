import { Table } from 'antd'
import React, { useEffect } from 'react'
import { deleteUserAction, getAllUserAction } from '../redux/actions/userAction'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { actionOpenModal } from '../redux/actions/ModalAction'
import AddUser from '../components/AddUser'
import UpdateUser from '../components/UpdateUser'

const UserManagement = () => {
	const dispatch = useDispatch()
	const { users } = useSelector((state) => state.userReducer)

	useEffect(() => {
		dispatch(getAllUserAction())
	}, [])

	const columns = [
		{
			title: 'Username',
			dataIndex: 'username',
		},
		{
			title: 'Role',
			dataIndex: 'role',
		},
		{
			title: 'Full Name',
			dataIndex: 'fullName',
		},
		{
			title: 'Phone Number',
			dataIndex: 'phoneNumber',
		},
		{
			title: 'Email',
			dataIndex: 'email',
		},
		{
			title: 'Address',
			dataIndex: 'address',
		},
		{
			title: 'Delete / Edit',
			render(text, record) {
				return (
					<div className='flex gap-4 justify-center'>
						<button
							onClick={() => {
								if (window.confirm('Are You Sure To Delete This User ?') === true) {
									dispatch(deleteUserAction(record.pk))
								}
							}}
							disabled={record.username === 'admin'}
							className='text-red-500 cursor-pointer text-2xl'>
							<AiFillDelete />
						</button>
						<button
							onClick={() => dispatch(actionOpenModal('Update User', <UpdateUser user={record} />))}
							className='text-blue-500 cursor-pointer text-2xl'>
							<AiFillEdit />
						</button>
					</div>
				)
			},
		},
	]

	return (
		<div className='flex flex-col gap-8'>
			<h1 className='text-4xl font-semibold'>User Management</h1>
			<div>
				<button
					onClick={() => dispatch(actionOpenModal('Create New User', <AddUser />))}
					className='bg-green-700 py-2 px-4 font-semibold text-white rounded-lg shadow-lg shadow-gray-500'>
					Add New User
				</button>
			</div>
			<Table
				rowKey={(record) => {
					return record.pk
				}}
				bordered
				columns={columns}
				dataSource={users}
			/>
		</div>
	)
}

export default UserManagement
