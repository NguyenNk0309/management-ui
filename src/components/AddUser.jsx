import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { AiFillLock, AiFillPhone, AiOutlineMail, AiOutlineUser } from 'react-icons/ai'
import { BiRename } from 'react-icons/bi'
import { FaRegAddressBook } from 'react-icons/fa'
import { signUpAction } from '../redux/actions/authenAction'

const AddUser = () => {
	const dispatch = useDispatch()

	const formik = useFormik({
		initialValues: {
			username: '',
			password: '',
			address: '',
			email: '',
			phoneNumber: '',
			fullName: '',
		},
		validationSchema: Yup.object({
			username: Yup.string().required('Username is required').min(5, 'Username must have min 5 characters'),
			email: Yup.string().email('Invalid email address').required('Email is required'),
			password: Yup.string().required('Password is required').min(5, 'Password must have min 5 characters'),
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
			dispatch(signUpAction(values))
		},
	})

	return (
		<div>
			<form onSubmit={formik.handleSubmit} className='flex flex-col gap-4 items-center justify-center grow px-10'>
				<div className='w-full'>
					<div className='w-full flex items-center text-xl gap-4 border px-4 py-1'>
						<AiOutlineUser />
						<input
							onChange={formik.handleChange}
							value={formik.values.username}
							placeholder='Username'
							name='username'
							className='focus:outline-none w-full'
							type='text'
						/>
					</div>
					{formik.touched.username && formik.errors.username ? (
						<span className='text-red-500'>{formik.errors.username}</span>
					) : null}
				</div>
				<div className='w-full'>
					<div className='w-full flex items-center text-xl gap-4 border px-4 py-1'>
						<AiFillLock />
						<input
							onChange={formik.handleChange}
							value={formik.values.password}
							placeholder='Password'
							name='password'
							className='focus:outline-none w-full'
							type='password'
						/>
					</div>
					{formik.touched.password && formik.errors.password ? (
						<span className='text-red-500'>{formik.errors.password}</span>
					) : null}
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
					className='bg-green-700 rounded-lg shadow-lg shadow-gray-500 w-full px-4 py-2 font-semibold text-white'>
					Create User
				</button>
			</form>
		</div>
	)
}

export default AddUser
