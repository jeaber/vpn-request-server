"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express = require('express'), app = express(), server = require('http').createServer(app), compress = require('compression'), circularJSON = require('circular-json');
// CONFIG SERVER
const config = {
    port: 9494
};
app.use(compress());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.post('/vpnrequest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body) {
        let config;
        if (typeof req.body.config === 'string') {
            config = JSON.parse(req.body.config);
        }
        else {
            config = req.body.config;
        }
        let response;
        let error;
        yield axios_1.default(config)
            .then(r => {
            response = r;
        })
            .catch((e) => {
            error = e;
        });
        if (response) {
            // console.log('/vpnrequest success', !!error);
            res.status(200).send({ message: 'ok', response: circularJSON.stringify(response) });
        }
        else if (error) {
            // console.log('/vpnrequest error', error);
            // { "message": "Request failed with status code 404", "name": "Error", "stack": "Error: Request failed with status code 404\\n    at createError (/home/jeab/Projects/dayz-killfeed/node_modules/axios/lib/core/createError.js:16:15)\\n    at settle (/home/jeab/Projects/dayz-killfeed/node_modules/axios/lib/core/settle.js:17:12)\\n    at IncomingMessage.handleStreamEnd (/home/jeab/Projects/dayz-killfeed/node_modules/axios/lib/adapters/http.js:236:11)\\n    at IncomingMessage.emit (events.js:326:22)\\n    at endReadableNT (_stream_readable.js:1244:12)\\n    at processTicksAndRejections (internal/process/task_queues.js:80:21)", "config": { "url": "http://httpstat.us/404", "method": "get", "headers": { "Accept": "application/json, text/plain, */*", "User-Agent": "axios/0.19.2" }, "transformRequest": [null], "transformResponse": [null], "timeout": 0, "xsrfCookieName": "XSRF-TOKEN", "xsrfHeaderName": "X-XSRF-TOKEN", "maxContentLength": -1 } } '
            res.status(200).send({
                message: error.message,
                name: error.name,
                stack: error.stack,
                config: error.config,
                response: circularJSON.stringify(error.response)
            });
        }
        else {
            res.status(500).send({ message: `Error no response` });
        }
    }
    else {
        console.error('no req.body');
    }
}));
server.listen(config.port, () => {
    console.log("Express server listening on port %d", config.port);
});
//# sourceMappingURL=index.js.map