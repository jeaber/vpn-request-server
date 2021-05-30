import Axios, { AxiosRequestConfig } from "axios";
import { interval } from "rxjs";
const timeAgo = require('node-time-ago');
var ping = require('ping');
export const VPNS = ['192.168.1.90', '192.168.1.91', '192.168.1.92', '192.168.1.93', '192.168.1.80', '192.168.1.81', '192.168.1.82']; // 
// export const VPNS = ['localhost'];
const vpnData = VPNS.map(ip => {
	return { ip, lastused: Date.now(), alive: true }
});

interval(5000).subscribe(() => {
	vpnData.forEach((host) => {
		ping.sys.probe(host.ip, (isAlive) => {
			// var msg = isAlive ? 'host ' + host.ip + ' is alive' : 'host ' + host.ip + ' is dead';
			host.alive = isAlive;
			// console.log(msg);
		});
	});
});

export async function vpnAxiosRequest(config: AxiosRequestConfig): Promise<any> {
	// const random = free ? VPNS_FREE[Math.floor(Math.random() * VPNS_FREE.length)] : VPNS[Math.floor(Math.random() * VPNS.length)];
	const vpn = getOldestUsed();
	return new Promise(async (resolve, reject) => {
		await Axios({
			method: 'POST',
			url: `http://${vpn}:9494/vpnrequest`,
			data: {
				config
			}
		})
			.then(res => {
				console.log('vpnAxiosRequest res1', res.data.message)
				res.data.response = JSON.parse(res.data.response);
				if (res.data.name === 'Error') {
					console.log('---', res, '----')
					// console.log('vpnAxiosRequest err res2', JSON.parse(res.data.data));
					reject(res.data);
				} else if (res.data.message === 'ok') {
					// console.log('vpnAxiosRequest ok res2', res.data.data)
					resolve(res && res.data && res.data.response);
				}
				console.log('vpnAxiosRequest success')
			})
			.catch(err => {
				reject(new Error(err));
				console.log('vpnAxiosRequest err', err)
			});
	})
}
function getOldestUsed(): string {
	const sorted = vpnData.filter((vpn) => vpn.alive).sort((a, b) => a.lastused - b.lastused);
	sorted[0].lastused = Date.now();
	return sorted[0].ip;
}
