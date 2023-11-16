// 'http://luizkun.duckdns.org:8080'
// 'http://localhost:8080'

export const LINK_API = 'http://luizkun.duckdns.org:8080'

export const ACCESS_TOKEN = 'ACCESS_TOKEN'

export const ROLE = 'ROLE'

export const USER_ID = 'USER_ID'

export const ADMIN_ROLE = 'ADMIN'

export const USER_ROLE = 'USER'

export const DAYS_OF_WEEK = [
	{ display: 'Monday', value: 0 },
	{ display: 'Tuesday', value: 1 },
	{ display: 'Wednesday', value: 2 },
	{ display: 'Thursday', value: 3 },
	{ display: 'Friday', value: 4 },
	{ display: 'Saturday', value: 5 },
	{ display: 'Sunday', value: 6 },
]

export const HOURS_IN_DAY = Array.from({ length: 24 }, (_, i) => i)

export const DAYS_IN_MONTH = Array.from({ length: 31 }, (_, i) => i + 1)

export const MONTHS_IN_YEAR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export function formatTime(type, time) {
	switch (type) {
		case 'day':
			if (time >= 0 && time <= 23) {
				return time + 'h'
			}
			break

		case 'month':
			if (time >= 1 && time <= 31) {
				if (time === 1) return time + 'st'
				if (time === 2) return time + 'nd'
				if (time === 3) return time + 'rd'
				if (time >= 4 && time <= 20) return time + 'th'
				if (time >= 21 && time <= 31) {
					const lastDigit = time % 10
					if (lastDigit === 1) return time + 'st'
					if (lastDigit === 2) return time + 'nd'
					if (lastDigit === 3) return time + 'rd'
					return time + 'th'
				}
			}
			break

		case 'year':
			const months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			]
			if (time >= 1 && time <= 12) {
				return months[time - 1]
			}
			break

		default:
			break
	}
}
