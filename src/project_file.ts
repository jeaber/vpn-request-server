import Axios, { AxiosRequestConfig } from "axios";

export const VPNS = ['http://192.168.1.90:9494', 'http://192.168.1.91:9494', 'http://192.168.1.92:9494', 'http://192.168.1.93:9494', 'http://192.168.1.80:9494', 'http://192.168.1.81:9494', 'http://192.168.1.82:9494']; // 

const vpnData = VPNS.map(ip => {
	return { ip, lastused: Date.now() }
});
export async function vpnAxiosRequest(config: AxiosRequestConfig) {
	// const random = free ? VPNS_FREE[Math.floor(Math.random() * VPNS_FREE.length)] : VPNS[Math.floor(Math.random() * VPNS.length)];

	const response = await Axios({
		method: 'POST',
		url: `${getOldestUsed()}/vpnrequest`,
		data: {
			config
		}
	});
	const parsedRes = response && response.data && JSON.parse(response.data.data);
	return parsedRes;
}
function getOldestUsed(): string {
	const sorted = vpnData.sort((a, b) => a.lastused - b.lastused);
	sorted[0].lastused = Date.now();
	return sorted[0].ip;
}