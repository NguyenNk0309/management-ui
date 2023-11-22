import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Loading from './components/Loading'
import ModalBase from './components/ModalBase'
import AuthenTemplate from './templates/AuthenTemplate'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { useDispatch, useSelector } from 'react-redux'
import { ASSIGN_NAVIGATE } from './redux/constants/navigateConstant'
import NotFound from './pages/NotFound'
import UserInfo from './pages/UserInfo'
import UserManagement from './pages/UserManagement'
import RoomInfo from './pages/RoomInfo'
import { ACCESS_TOKEN, ADMIN_ROLE, LINK_API, ROLE, USER_ID } from './utils/constant'
import HomeTemplate from './templates/HomeTemplate'
import { validateToken } from './redux/actions/authenAction'
import SockJS from 'sockjs-client'
import { over } from 'stompjs'
import { notification } from 'antd'
import { PiWarningCircleFill } from 'react-icons/pi'

function App() {
	const dispatch = useDispatch()

	const navigate = useNavigate()

	const { isLoading } = useSelector((state) => state.loadingReducer)

	useEffect(() => {
		dispatch({ type: ASSIGN_NAVIGATE, payload: navigate })

		if (localStorage.getItem(ACCESS_TOKEN)) {
			dispatch(validateToken())
		}
	}, [])

	useEffect(() => {
		const socket = new SockJS(LINK_API + '/ws/registry')
		const stompClient = over(socket)

		if (!localStorage.getItem(USER_ID)) {
			if (stompClient.connected) {
				stompClient.disconnect()
			}
		} else {
			stompClient.connect({}, () => {
				stompClient.subscribe(`/ws/topic/user/${localStorage.getItem(USER_ID)}`, (response) => {
					const data = JSON.parse(response.body)
					notification.open({
						message: <span className='font-semibold'>{data.title}</span>,
						description: data.description,
						icon: <PiWarningCircleFill className='text-blue-500' />,
						duration: 10,
					})
				})
			})
		}
	}, [localStorage.getItem(USER_ID)])

	return (
		<div id='App' className='w-full min-h-screen'>
			{isLoading ? <Loading /> : null}
			<ModalBase />
			<Routes>
				<Route element={<AuthenTemplate />}>
					<Route path='sign-in' element={<SignIn />} />
					<Route path='sign-up' element={<SignUp />} />
				</Route>

				<Route element={<ProtectedRoute condition={localStorage.getItem(ACCESS_TOKEN)} navigate='/sign-in' />}>
					<Route element={<HomeTemplate />}>
						<Route path='user'>
							<Route element={<UserInfo />} path='info' />
							<Route
								element={
									<ProtectedRoute
										condition={localStorage.getItem(ROLE) === ADMIN_ROLE}
										navigate='*'
									/>
								}>
								<Route element={<UserManagement />} path='management' />
							</Route>
							<Route path='' element={<Navigate to='info' />} />
						</Route>
						<Route path='room'>
							<Route element={<RoomInfo />} path='info/:token' />
							<Route path='' element={<Navigate to='info' />} />
						</Route>
					</Route>
				</Route>

				<Route path='' element={<Navigate to='/user/info' />} />
				<Route path='*' element={<Navigate to='/not-found' />} />
				<Route path='/not-found' element={<NotFound />} />
			</Routes>
		</div>
	)
}

export default App
