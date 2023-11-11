import { useFormik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { AiOutlineUser, AiFillPhone, AiOutlineMail } from 'react-icons/ai'
import { FaRegAddressBook } from 'react-icons/fa'
import { BiRename } from 'react-icons/bi'
import { updateUserAction } from '../redux/actions/userAction'

const UpdateUser = ({ user }) => {
	const dispatch = useDispatch()

	const formik = useFormik({
		initialValues: {
			username: user.username,
			role: user.role,
			address: user.address,
			email: user.email,
			phoneNumber: user.phoneNumber,
			fullName: user.fullName,
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
			dispatch(updateUserAction(values, user.pk))
		},
	})
	return (
		<div>
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

				<div className='w-full'>
					<div className='w-full flex items-center text-xl gap-4 border px-4 py-1'>
						<AiOutlineUser />
						<select
							disabled={formik.values.username === 'admin'}
							onChange={formik.handleChange}
							value={formik.values.role}
							name='role'
							className='focus:outline-none w-full'>
							<option value='ADMIN'>ROLE: ADMIN</option>
							<option value='USER'>ROLE: USER</option>
						</select>
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
					Update User Info
				</button>
			</form>
		</div>
	)
}

export default UpdateUser
