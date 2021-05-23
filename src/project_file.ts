import Axios, { AxiosRequestConfig } from "axios";

// export const VPNS = ['http://192.168.1.90:9292', 'http://192.168.1.91:9292', 'http://192.168.1.92:9292', 'http://192.168.1.93:9292', 'http://192.168.1.80:9292', 'http://192.168.1.81:9292']; // 
// export const VPNS_FREE = ['http://192.168.1.80:9292', 'http://192.168.1.81:9292', 'http://192.168.1.82:9292']; // 
export const VPNS = ['http://192.168.1.80:9494']; // 
export const VPNS_FREE = ['http://192.168.1.80:9494']; // 

export async function vpnAxiosRequest(config: AxiosRequestConfig, free?: boolean) {
	const random = free ? VPNS_FREE[Math.floor(Math.random() * VPNS_FREE.length)] : VPNS[Math.floor(Math.random() * VPNS.length)];
	const response = await Axios({
		method: 'POST',
		url: `${random}/vpnrequest`,
		data: {
			config
		}
	});
	const parsedRes = response && response.data && JSON.parse(response.data.data);
	return parsedRes;
}