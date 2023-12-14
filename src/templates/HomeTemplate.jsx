import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineUser, AiOutlinePlusSquare } from 'react-icons/ai'
import { BsDoorOpen } from 'react-icons/bs'
import { GoSignOut } from 'react-icons/go'
import { NavLink, Outlet } from 'react-router-dom'
import { signOutAction } from '../redux/actions/authenAction'
import { ADMIN_ROLE } from '../utils/constant'
import { getAllRoomsOfUserAction } from '../redux/actions/roomAction'
import { actionOpenModal } from '../redux/actions/ModalAction'
import CreateRoom from '../pages/CreateRoom'
import { FaReact } from 'react-icons/fa6'

const HomeTemplate = () => {
	const dispatch = useDispatch()
	const { myInfo } = useSelector((state) => state.userReducer)
	const { myRooms } = useSelector((state) => state.roomReducer)

	const [menuOpenKey, setMenuOpenKey] = useState([window.location.pathname.split('/')[1]])

	useEffect(() => {
		setMenuOpenKey((prev) => {
			if (prev.includes(window.location.pathname.split('/')[1])) {
				return [...prev]
			} else {
				return [window.location.pathname.split('/')[1], ...prev]
			}
		})
	}, [window.location.pathname.split('/')[1]])

	useEffect(() => {
		dispatch(getAllRoomsOfUserAction())
	}, [])

	function getItem(label, key, icon, children) {
		return {
			key,
			icon,
			children,
			label,
			onTitleClick: (e) => {
				setMenuOpenKey((prev) => {
					if (prev.includes(e.key)) {
						const arr = [...prev]
						arr.splice(
							arr.findIndex((menu) => menu === e.key),
							1
						)
						return arr
					} else {
						return [e.key, ...prev]
					}
				})
			},
		}
	}
	const items = [
		getItem(
			<div className='flex items-center gap-2'>
				<AiOutlineUser className='text-lg text-violet-600' />
				<h1 className='text-violet-600 font-semibold text-md'>User Management</h1>
			</div>,
			'user',
			null,
			[
				getItem(
					<NavLink to={'/user/info'}>
						{({ isActive }) => (
							<span className={isActive ? 'text-white font-semibold' : 'text-black font-semibold'}>
								User Information
							</span>
						)}
					</NavLink>,
					'/user/info'
				),
				myInfo.role === ADMIN_ROLE
					? getItem(
							<NavLink to={'/user/management'}>
								{({ isActive }) => (
									<span
										className={isActive ? 'text-white font-semibold' : 'text-black font-semibold'}>
										Users Data
									</span>
								)}
							</NavLink>,
							'/user/management'
					  )
					: null,
			]
		),
		{
			type: 'divider',
		},
		getItem(
			<div className='flex items-center gap-2'>
				<BsDoorOpen className='text-lg text-violet-600' />
				<h1 className='text-violet-600 font-semibold text-md'>Room Management</h1>
			</div>,
			'room',
			null,
			JSON.stringify(myRooms) !== '{}'
				? myRooms.map((room) =>
						getItem(
							<NavLink to={`/room/info/${room.token}`}>
								{({ isActive }) => (
									<span
										className={isActive ? 'text-white font-semibold' : 'text-black font-semibold'}>
										{room.name}
									</span>
								)}
							</NavLink>,
							`/room/info/${room.token}`
						)
				  )
				: null
		),
		myInfo.role === ADMIN_ROLE
			? {
					label: <span className='text-black font-semibold'>Add New Room</span>,
					onClick: () => {
						dispatch(actionOpenModal('Add New Room', <CreateRoom />))
					},
			  }
			: null,
	]

	return (
		<div className='flex'>
			<div className='w-2/12 h-screen fixed top-0 left-0 bg-violet-500 py-8 p-3 flex flex-col justify-between'>
				<div>
					<div className='flex items-center justify-start gap-4 border-b-[1px] border-white pb-6'>
						<FaReact className='w-8 h-8 text-white' />
						<h1 className='text-lg text-white font-semibold'>Smart Room</h1>
					</div>
					<div className='rounded-md pt-6'>
						<Menu
							className='w-full rounded-md'
							selectedKeys={[window.location.pathname]}
							openKeys={menuOpenKey}
							mode='inline'
							items={items}
						/>
					</div>
				</div>
				<div
					onClick={() => {
						dispatch(signOutAction())
					}}
					className='flex items-center gap-4 text-white font-semibold text-2xl bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer shadow-slate-600 shadow-lg'>
					<GoSignOut />
					<span>Sign Out</span>
				</div>
			</div>

			<div className='w-10/12 absolute right-0 top-0 py-8 px-4'>
				<div>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default HomeTemplate
