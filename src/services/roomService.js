import axios from 'axios'
import { ACCESS_TOKEN, LINK_API } from '../utils/constant'

const roomService = {
	getAllRoomsOfUser(data) {
		return axios({
			url: `${LINK_API}/room/of-user/${data}`,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	getAllRooms() {
		return axios({
			url: `${LINK_API}/room/all`,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	updateHardware(payload) {
		return axios({
			url: `${LINK_API}/room/updateHardware/${payload.pk}`,
			method: 'PUT',
			data: payload.data,
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	createRoom(payload) {
		return axios({
			url: `${LINK_API}/room/create?room-name=${payload.roomName}&user-pk=${payload.userPk}`,
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	getHardwareUpdateHistories(data) {
		return axios({
			url: `${LINK_API}/room/${data.roomPk}/hardware-histories-of-week?week=${data.week}`,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	getPowerAndWaterConsumptionHistories(data) {
		return axios({
			url: `${LINK_API}/room/${data.roomPk}/power-water-consumption-histories?timeType=${data.timeType}&timeFilter=${data.timeFilter}`,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	getAmpereAndVoltageHistories(data) {
		return axios({
			url: `${LINK_API}/room/${data.roomPk}/ampere-voltage-histories?timeFilter=${data.timeFilter}`,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	deleteRoomByPk(roomPk) {
		return axios({
			url: `${LINK_API}/room/delete/${roomPk}`,
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	updateRoomName({ roomPk, roomName }) {
		return axios({
			url: `${LINK_API}/room/update/${roomPk}?name=${roomName}`,
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	getHardwareLimit(roomPk) {
		return axios({
			url: `${LINK_API}/room/get/hardware-limit/${roomPk}`,
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	updateHardwareLimit({ roomPk, data }) {
		return axios({
			url: `${LINK_API}/room/update/hardware-limit/${roomPk}`,
			method: 'PUT',
			data,
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
	deleteHardwareLimit({ roomPk, hardwareId }) {
		return axios({
			url: `${LINK_API}/room/delete/hardware-limit/${roomPk}?hardwareId=${hardwareId}`,
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
			},
		})
	},
}

export default roomService
