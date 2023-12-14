import { useFormik } from 'formik'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { AiOutlineUser, AiFillLock, AiFillPhone, AiOutlineMail } from 'react-icons/ai'
import { FaRegAddressBook } from 'react-icons/fa'
import { BiRename } from 'react-icons/bi'
import { updateUserAction } from '../redux/actions/userAction'
import { USER_ID } from '../utils/constant'

const UserInfo = () => {
	const dispatch = useDispatch()
	const { myInfo } = useSelector((state) => state.userReducer)

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			username: myInfo.username,
			address: myInfo.address,
			email: myInfo.email,
			phoneNumber: myInfo.phoneNumber,
			fullName: myInfo.fullName,
			currentPassword: '',
			newPassword: '',
		},
		validationSchema: Yup.object({
			username: Yup.string().required('Username is required').min(5, 'Username must have min 5 characters'),
			email: Yup.string().email('Invalid email address').required('Email is required'),
			address: Yup.string().required('Address is required'),
			fullName: Yup.string()
				.required('Name is required')
				.min(3, 'Name must have min 3 characters')
				.max(18, 'Name must have max 18 characters'),
			phoneNumber: Yup.string()
				.required('Phone number is required')
				.length(10, 'Phone number must have 10 numbers')
				.matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Phone number is invalid'),
		}),
		onSubmit: (values) => {
			dispatch(updateUserAction(values, localStorage.getItem(USER_ID)))
		},
	})

	return (
		<div className='flex flex-col gap-8'>
			<h1 className='text-4xl font-semibold'>User Information</h1>

			<div className='flex gap-4 items-start'>
				<div className='w-4/12 shadow-lg shadow-gray-500 p-4 rounded-lg flex flex-col'>
					<div className='w-full flex justify-center my-8'>
						<img
							className='w-40 h-40 rounded-full'
							src={`https://ui-avatars.com/api/?name=${myInfo.fullName}`}
							alt=''
						/>
					</div>
					<span className='text-center font-semibold text-lg'>
						Welcome Back, <span className='text-blue-500'>{myInfo.fullName}</span>
					</span>
				</div>
				<div className='w-8/12 shadow-lg shadow-gray-500 p-4 rounded-lg'>
					<h1 className='font-semibold text-lg'>Account Detail</h1>
					<form
						onSubmit={formik.handleSubmit}
						className='flex flex-col gap-4 items-center justify-center grow px-10 my-8'>
						<div className='w-full'>
							<div className='w-full flex items-center text-xl gap-4 border px-4 py-1'>
								<AiOutlineUser />
								<input
									disabled
									onChange={formik.handleChange}
									value={formik.values.username}
									placeholder='Username'
									name='username'
									className='focus:outline-none w-full disabled:text-gray-400 cursor-not-allowed'
									type='text'
								/>
							</div>
							{formik.touched.username && formik.errors.username ? (
								<span className='text-red-500'>{formik.errors.username}</span>
							) : null}
						</div>
						<div className='w-full flex gap-4'>
							<div className='w-6/12 flex items-center text-xl gap-4 border px-4 py-1'>
								<AiFillLock />
								<input
									onChange={formik.handleChange}
									value={formik.values.currentPassword}
									placeholder='Current Password'
									name='currentPassword'
									className='focus:outline-none w-full'
									type='password'
								/>
							</div>
							<div className='w-6/12 flex items-center text-xl gap-4 border px-4 py-1'>
								<AiFillLock />
								<input
									disabled={formik.values.currentPassword !== '' ? false : true}
									onChange={formik.handleChange}
									value={formik.values.newPassword}
									placeholder='New Password'
									name='newPassword'
									className={`focus:outline-none w-full ${
										formik.values.currentPassword !== '' ? '' : 'cursor-not-allowed'
									}`}
									type='password'
								/>
							</div>
						</div>
						<div className='w-full'>
							<div className='w-full flex items-center text-xl gap-4 border px-4 py-1'>
								<AiOutlineMail />
								<input
									onChange={formik.handleChange}
									value={formik.values.email}
									placeholder='Email'
									name='email'
									className='focus:outline-none w-full'
									type='email'
								/>
							</div>
							{formik.touched.email && formik.errors.email ? (
								<span className='text-red-500'>{formik.errors.email}</span>
							) : null}
						</div>
						<div className='w-full'>
							<div className='w-full flex items-center text-xl gap-4 border px-4 py-1'>
								<FaRegAddressBook />
								<input
									onChange={formik.handleChange}
									value={formik.values.address}
									placeholder='Address'
									name='address'
									className='focus:outline-none w-full'
									type='text'
								/>
							</div>
							{formik.touched.address && formik.errors.address ? (
								<span className='text-red-500'>{formik.errors.address}</span>
							) : null}
						</div>
						<div className='w-full'>
							<div className='w-full flex items-center text-xl gap-4 border px-4 py-1'>
								<BiRename />
								<input
									onChange={formik.handleChange}
									value={formik.values.fullName}
									placeholder='Full name'
									name='fullName'
									className='focus:outline-none w-full'
									type='text'
								/>
							</div>
							{formik.touched.fullName && formik.errors.fullName ? (
								<span className='text-red-500'>{formik.errors.fullName}</span>
							) : null}
						</div>
						<div className='w-full'>
							<div className='w-full flex items-center text-xl gap-4 border px-4 py-1'>
								<AiFillPhone />
								<input
									onChange={formik.handleChange}
									value={formik.values.phoneNumber}
									placeholder='Phone number'
									name='phoneNumber'
									className='focus:outline-none w-full'
									type='text'
								/>
							</div>
							{formik.touched.phoneNumber && formik.errors.phoneNumber ? (
								<span className='text-red-500'>{formik.errors.phoneNumber}</span>
							) : null}
						</div>
						<button
							type='submit'
							className='bg-blue-500 w-full px-4 py-2 rounded-lg shadow-lg shadow-gray-500 font-semibold text-white'>
							Update Info
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default UserInfo
