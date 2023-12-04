import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import SockJS from 'sockjs-client'
import { DAYS_IN_MONTH, HOURS_IN_DAY, LINK_API, MONTHS_IN_YEAR, formatTime } from '../utils/constant'
import { over } from 'stompjs'
import { FaFire, FaTemperatureFull, FaWater } from 'react-icons/fa6'
import { FaCalendarAlt } from 'react-icons/fa'
import { MdOutlineElectricalServices } from 'react-icons/md'
import { GrStatusGoodSmall } from 'react-icons/gr'
import { IoMdMore } from 'react-icons/io'
import { WiHumidity } from 'react-icons/wi'
import { MdGasMeter } from 'react-icons/md'
import { ImSwitch } from 'react-icons/im'
import { Calendar, Popconfirm, Popover, Switch, Tabs } from 'antd'
import {
	deleteRoomAction,
	getHardwareLimitAction,
	getPowerAndWaterConsumptionHistoriesAction,
	updateHardwareAction,
	updateRoomNameAction,
} from '../redux/actions/roomAction'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import moment from 'moment/moment'
import dayjs from 'dayjs'
import HardwareLimitEditor from '../components/HardwareLimitEditor'
import { GET_NEW_UPDATED_ROOM_NAME } from '../redux/constants/roomConstant'

const defaultHardwareValue = {
	gasSensorValue: 'N/A',
	voltageSensorValue: 'N/A',
	ampereSensorValue: 'N/A',
	temperatureSensorValue: 'N/A',
	humiditySensorValue: 'N/A',
	waterSensorValue: 'N/A',
	fireSensor1Value: 'N/A',
	fireSensor2Value: 'N/A',
	fireSensor3Value: 'N/A',
	fireSensor4Value: 'N/A',
	fireSensor5Value: 'N/A',
	acSwitch1: false,
	acSwitch2: false,
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top',
		},
	},
	scales: {
		y: {
			type: 'linear',
			display: true,
			position: 'left',
			title: {
				display: true,
				align: 'end',
				text: 'kW/h',
				color: 'rgb(142, 68, 199)',
				font: {
					size: 20,
				},
			},
		},
		y1: {
			type: 'linear',
			display: true,
			position: 'right',
			title: {
				display: true,
				align: 'end',
				text: 'm3',
				color: 'rgb(55, 217, 98)',
				font: {
					size: 20,
				},
			},
		},
	},
}

const RoomInfo = () => {
	const { myRooms, powerAndWaterHistories, hardwareLimit, roomName } = useSelector((state) => state.roomReducer)
	const dispatch = useDispatch()
	const pathVariable = useParams().token

	const [hardware, setHardware] = useState()
	const [thisRoom, setThisRoom] = useState()
	const [activeTab, setActiveTab] = useState('day')
	const [calendar, setCalendar] = useState({ display: moment().format('yyyy-MM-DD'), value: dayjs() })

	useEffect(() => {
		setHardware(defaultHardwareValue)

		const socket = new SockJS(LINK_API + '/ws/registry')
		const stompClient = over(socket)
		stompClient.connect({}, () => {
			stompClient.subscribe(`/ws/topic/${pathVariable}`, (response) => {
				const data = JSON.parse(response.body)
				setHardware(data)
			})
		})
		if (myRooms.length > 0) {
			const thisRoom = myRooms.find((room) => room.token === pathVariable)
			setActiveTab('day')
			setCalendar({ display: moment().format('yyyy-MM-DD'), value: dayjs() })
			setThisRoom(thisRoom)
			dispatch({ type: GET_NEW_UPDATED_ROOM_NAME, payload: thisRoom.name })
			dispatch(getHardwareLimitAction(thisRoom.pk))
			dispatch(
				getPowerAndWaterConsumptionHistoriesAction({
					roomPk: thisRoom.pk,
					timeType: 'day',
					timeFilter: moment().format('yyyy-MM-DD'),
				})
			)
		}
		return () => {
			if (stompClient.connected) {
				stompClient.disconnect()
			}
		}
	}, [pathVariable, myRooms.length])

	function powerAndWaterConsumptionData(labels) {
		return {
			labels: labels.map((label) => formatTime(activeTab, label)),
			datasets: [
				{
					label: 'Power Consumption',
					data: labels.map((time) => {
						const timeFound = powerAndWaterHistories.find((item) => item.time === time)
						return timeFound?.powerConsumption
					}),
					borderColor: 'rgb(255, 99, 132)',
					backgroundColor: 'rgba(142, 68, 199, 0.5)',
					yAxisID: 'y',
				},
				{
					label: 'Water Consumption',
					data: labels.map((time) => {
						const timeFound = powerAndWaterHistories.find((item) => item.time === time)
						return timeFound?.waterConsumption
					}),
					borderColor: 'rgb(255, 99, 132)',
					backgroundColor: 'rgba(55, 217, 98, 0.5)',
					yAxisID: 'y1',
				},
			],
		}
	}

	const items = [
		{
			key: 'day',
			label: 'DAY',
			children: <Bar options={options} data={powerAndWaterConsumptionData(HOURS_IN_DAY)} />,
		},
		{
			key: 'month',
			label: 'MONTH',
			children: <Bar options={options} data={powerAndWaterConsumptionData(DAYS_IN_MONTH)} />,
		},
		{
			key: 'year',
			label: 'YEAR',
			children: <Bar options={options} data={powerAndWaterConsumptionData(MONTHS_IN_YEAR)} />,
		},
	]

	return (
		<div className='flex flex-col gap-20 p-8 shadow-slate-600 shadow-lg rounded-2xl'>
			<div className='flex flex-col gap-4'>
				<div className='flex items-start'>
					<h1 className='text-4xl'>
						Room Name:
						<Popconfirm
							placement='bottomLeft'
							icon={<></>}
							title={'Delete / Change Room Name'}
							okText='Change Name'
							cancelText='Delete'
							onCancel={() => {
								if (window.confirm('Are You Sure To Delete This Room ?') === true) {
									dispatch(deleteRoomAction(thisRoom.pk))
								}
							}}
							onConfirm={() => {
								let roomName = prompt('Please Enter Your New Name:', thisRoom.name)
								roomName = roomName.trim()
								if (roomName !== null && roomName !== '') {
									dispatch(updateRoomNameAction({ roomPk: thisRoom.pk, roomName }))
								}
							}}
							cancelButtonProps={{
								style: {
									background: 'red',
									color: 'white',
								},
							}}
							okButtonProps={{
								style: {
									background: 'blue',
									color: 'white',
								},
							}}>
							<span className='underline text-blue-600 cursor-pointer'>{roomName}</span>
						</Popconfirm>
					</h1>
					<div>
						{thisRoom?.isUsed ? (
							<GrStatusGoodSmall className='text-green-500' />
						) : (
							<GrStatusGoodSmall className='text-red-500' />
						)}
					</div>
				</div>
				<div className='grid grid-cols-5 gap-8'>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V0')}
										hardwareId={'V0'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<MdGasMeter className='text-blue-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Gas Sensor</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.gasSensorValue}</h1>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V5')}
										hardwareId={'V5'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<FaWater className='text-blue-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Water Sensor</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.waterSensorValue}</h1>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V3')}
										hardwareId={'V3'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<FaTemperatureFull className='text-green-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Temperature Sensor</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.temperatureSensorValue}</h1>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V4')}
										hardwareId={'V4'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<WiHumidity className='text-green-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Humidity Sensor</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.humiditySensorValue}</h1>
					</div>
					<div></div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V1')}
										hardwareId={'V1'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<MdOutlineElectricalServices className='text-orange-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Voltage Sensor</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.voltageSensorValue}</h1>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V2')}
										hardwareId={'V2'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<MdOutlineElectricalServices className='text-orange-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Ampere Sensor</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.ampereSensorValue}</h1>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<ImSwitch
							className={`${
								hardware?.acSwitch1 ? 'text-green-600' : 'text-red-600'
							} text-7xl transition-all`}
						/>
						<h1 className='font-semibold text-2xl text-center'>AC Switch 1</h1>
						<Switch
							onChange={(e) => {
								dispatch(
									updateHardwareAction({
										pk: thisRoom.pk,
										data: {
											acSwitch1: e,
											acSwitch2: hardware.acSwitch2,
										},
									})
								)
								setHardware({ ...hardware, acSwitch1: e })
							}}
							checked={hardware?.acSwitch1}
							style={{ backgroundColor: hardware?.acSwitch1 ? 'green' : 'red' }}
						/>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<ImSwitch
							className={`${
								hardware?.acSwitch2 ? 'text-green-600' : 'text-red-600'
							} text-7xl transition-all`}
						/>
						<h1 className='font-semibold text-2xl text-center'>AC Switch 2</h1>
						<Switch
							onChange={(e) => {
								dispatch(
									updateHardwareAction({
										pk: thisRoom.pk,
										data: {
											acSwitch1: hardware.acSwitch1,
											acSwitch2: e,
										},
									})
								)
								setHardware({ ...hardware, acSwitch2: e })
							}}
							checked={hardware?.acSwitch2}
							style={{ backgroundColor: hardware?.acSwitch2 ? 'green' : 'red' }}
						/>
					</div>
					<div></div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V6')}
										hardwareId={'V6'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<FaFire className='text-red-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Fire Sensor 1</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.fireSensor1Value}</h1>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V7')}
										hardwareId={'V7'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<FaFire className='text-red-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Fire Sensor 2</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.fireSensor2Value}</h1>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V8')}
										hardwareId={'V8'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<FaFire className='text-red-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Fire Sensor 3</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.fireSensor3Value}</h1>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V9')}
										hardwareId={'V9'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<FaFire className='text-red-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Fire Sensor 4</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.fireSensor4Value}</h1>
					</div>
					<div className='h-64 bg-black bg-opacity-10 rounded-2xl flex flex-col gap-4 items-center justify-center shadow-lg shadow-slate-600 p-4'>
						<div className='w-full flex items-center justify-end'>
							<Popover
								className='cursor-pointer'
								content={
									<HardwareLimitEditor
										hardwareLimit={hardwareLimit.find((item) => item?.hardwareId === 'V10')}
										hardwareId={'V10'}
										roomPk={thisRoom?.pk}
									/>
								}
								title='Limit Setup'
								trigger='click'
								destroyTooltipOnHide>
								<IoMdMore className='text-3xl' />
							</Popover>
						</div>
						<FaFire className='text-red-500 text-7xl' />
						<h1 className='font-semibold text-2xl text-center'>Fire Sensor 5</h1>
						<h1 className='font-semibold text-2xl'>{hardware?.fireSensor5Value}</h1>
					</div>
				</div>
			</div>
			<div className='flex flex-col gap-4'>
				<div className='flex items-center gap-4'>
					<h1 className='text-4xl'>Power And Water Consumption</h1>
					<Popover
						className='cursor-pointer'
						content={
							<Calendar
								className='w-96'
								value={calendar.value}
								fullscreen={false}
								onChange={(value) => {
									dispatch(
										getPowerAndWaterConsumptionHistoriesAction({
											roomPk: thisRoom.pk,
											timeType: activeTab,
											timeFilter: value.format('YYYY-MM-DD'),
										})
									)
									setCalendar({ display: value.format('YYYY-MM-DD'), value })
								}}
							/>
						}
						title='Date Picker'
						trigger='click'
						destroyTooltipOnHide>
						<FaCalendarAlt className='text-3xl' />
					</Popover>
				</div>

				<Tabs
					activeKey={activeTab}
					onChange={(activeTab) => {
						dispatch(
							getPowerAndWaterConsumptionHistoriesAction({
								roomPk: thisRoom.pk,
								timeType: activeTab,
								timeFilter: calendar.display,
							})
						)
						setActiveTab(activeTab)
					}}
					items={items}
				/>
			</div>
		</div>
	)
}

export default RoomInfo
