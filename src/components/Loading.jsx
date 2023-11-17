import { Spin } from 'antd'
import React from 'react'

const Loading = () => {
	return (
		<div className='fixed top-0 right-0 z-[100000] w-screen h-screen flex items-center justify-center bg-[rgba(0,0,0,0.7)]'>
			<Spin size='large' />
		</div>
	)
}

export default Loading
