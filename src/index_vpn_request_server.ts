require('dotenv').config();
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { interval, startWith } from "rxjs";
var exec = require('child_process').exec;

const express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	compress = require('compression'),
	circularJSON = require('circular-json');
// CONFIG SERVER
const config = {
	port: 9494
};
app.use(compress());
app.use(
	express.urlencoded({
		extended: true
	})
);
app.use(express.json());

app.post('/vpnrequest', async (req, res) => {
	if (req.body && req.body.config) {
		let config: AxiosRequestConfig;
		try {
			if (typeof req.body.config === 'string')
				config = JSON.parse(req.body.config);
			else
				config = req.body.config;
		} catch (e) {
			config = req.body.config;
		}

		let response;
		let error;
		await Axios(config)
			.then(r => {
				response = r;
			})
			.catch((e: Error) => {
				error = e;
			});
		let send;
		if (response) {
			try {
				send = circularJSON.stringify(response);
			} catch (e) {
				send = response;
			}
			// console.log('/vpnrequest success', !!error);
			res.status(200).send({ message: 'ok', response: send });
		} else if (error) {
			// console.log('/vpnrequest error', error);
			// { "message": "Request failed with status code 404", "name": "Error", "stack": "Error: Request failed with status code 404\\n    at createError (/home/jeab/Projects/dayz-killfeed/node_modules/axios/lib/core/createError.js:16:15)\\n    at settle (/home/jeab/Projects/dayz-killfeed/node_modules/axios/lib/core/settle.js:17:12)\\n    at IncomingMessage.handleStreamEnd (/home/jeab/Projects/dayz-killfeed/node_modules/axios/lib/adapters/http.js:236:11)\\n    at IncomingMessage.emit (events.js:326:22)\\n    at endReadableNT (_stream_readable.js:1244:12)\\n    at processTicksAndRejections (internal/process/task_queues.js:80:21)", "config": { "url": "http://httpstat.us/404", "method": "get", "headers": { "Accept": "application/json, text/plain, */*", "User-Agent": "axios/0.19.2" }, "transformRequest": [null], "transformResponse": [null], "timeout": 0, "xsrfCookieName": "XSRF-TOKEN", "xsrfHeaderName": "X-XSRF-TOKEN", "maxContentLength": -1 } } '
			try {
				send = circularJSON.stringify(error.response);
			} catch (e) {
				send = error.response;
			}
			res.status(200).send({
				message: error.message,
				name: error.name,
				stack: error.stack,
				config: error.config,
				response: send
			});
		} else {
			res.status(500).send({ message: `Error no response` });
		}
	} else {
		console.error('no req.body');
	}
});

server.listen(config.port, () => {
	console.log("Express server listening on port %d", config.port);
});


interval(60000)
	//	.pipe(startWith(0))
	.subscribe(async () => {
		await Axios('http://ifconfig.me')
			.then(r => {
				if (!r || !r.data || r.data.indexOf(`${process.env.wanip}`) === 0) {
					reboot(function (output) {
						console.log(output);
					});
				}
			})
			.catch((e: Error) => {
				reboot(function (output) {
					console.log(output);
				});
			});
	});
function reboot(callback) {
	exec(`echo '${process.env.sudopass}' | sudo -S /sbin/shutdown -r now`, function (error, stdout, stderr) { callback(`${error}, ${stdout}, ${stderr}`); });
}

