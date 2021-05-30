import Axios, { AxiosRequestConfig } from "axios";
const timeAgo = require('node-time-ago');
export const VPNS = ['http://192.168.1.90:9494', 'http://192.168.1.91:9494', 'http://192.168.1.92:9494', 'http://192.168.1.93:9494', 'http://192.168.1.80:9494', 'http://192.168.1.81:9494', 'http://192.168.1.82:9494']; // 
// export const VPNS = ['http://localhost:9494'];

const vpnData = VPNS.map(ip => {
	return { ip, lastused: Date.now() }
});
export async function vpnAxiosRequest(config: AxiosRequestConfig): Promise<any> {
	// const random = free ? VPNS_FREE[Math.floor(Math.random() * VPNS_FREE.length)] : VPNS[Math.floor(Math.random() * VPNS.length)];
	const vpn = getOldestUsed();
	return new Promise(async (resolve, reject) => {
		await Axios({
			method: 'POST',
			url: `${vpn}/vpnrequest`,
			data: {
				config
			}
		})
			.then(res => {
				// console.log('vpnAxiosRequest res1', res.data.message)
				res.data.response = JSON.parse(res.data.response);
				if (res.data.name === 'Error') {
					console.log('---', res, '----')
					// console.log('vpnAxiosRequest err res2', JSON.parse(res.data.data));
					reject(res.data);
				} else if (res.data.message === 'ok') {
					// console.log('vpnAxiosRequest ok res2', res.data.data)
					resolve(res && res.data && res.data.response);
				}
				// console.log('vpnAxiosRequest success')
			})
			.catch(err => {
				reject(new Error(err));
				// console.log('vpnAxiosRequest err', err)
			});
	})
}
function getOldestUsed(): string {
	const sorted = vpnData.sort((a, b) => a.lastused - b.lastused);
	sorted[0].lastused = Date.now();
	return sorted[0].ip;
}
