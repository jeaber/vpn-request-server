import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

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
	if (req.body) {
		let config: AxiosRequestConfig;
		if (typeof req.body.config === 'string') {
			config = JSON.parse(req.body.config);
		} else {
			config = req.body.config;
		}
		const response: AxiosResponse = await Axios(config);
		if (response)
			res.status(200).send({ message: 'ok', data: circularJSON.stringify(response) });
		else
			res.status(500).send({ message: 'err' });
	} else {
		console.error('no req.body');
	}
});

server.listen(config.port, () => {
	console.log("Express server listening on port %d", config.port);
});