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
exports.vpnAxiosRequest = exports.VPNS = void 0;
const axios_1 = __importDefault(require("axios"));
const rxjs_1 = require("rxjs");
const timeAgo = require('node-time-ago');
var ping = require('ping');
exports.VPNS = ['192.168.1.90', '192.168.1.91', '192.168.1.92', '192.168.1.93', '192.168.1.80', '192.168.1.81', '192.168.1.82']; // 
// export const VPNS = ['localhost'];
const vpnData = exports.VPNS.map(ip => {
    return { ip, lastused: Date.now(), alive: true };
});
rxjs_1.interval(5000).subscribe(() => {
    vpnData.forEach((host) => {
        ping.sys.probe(host.ip, (isAlive) => {
            // var msg = isAlive ? 'host ' + host.ip + ' is alive' : 'host ' + host.ip + ' is dead';
            host.alive = isAlive;
            // console.log(msg);
        });
    });
});
function vpnAxiosRequest(config) {
    return __awaiter(this, void 0, void 0, function* () {
        // const random = free ? VPNS_FREE[Math.floor(Math.random() * VPNS_FREE.length)] : VPNS[Math.floor(Math.random() * VPNS.length)];
        const vpn = getOldestUsed();
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default({
                method: 'POST',
                url: `http://${vpn}:9494/vpnrequest`,
                data: {
                    config
                }
            })
                .then(res => {
                console.log('vpnAxiosRequest res1', res.data.message);
                res.data.response = JSON.parse(res.data.response);
                if (res.data.name === 'Error') {
                    console.log('---', res, '----');
                    // console.log('vpnAxiosRequest err res2', JSON.parse(res.data.data));
                    reject(res.data);
                }
                else if (res.data.message === 'ok') {
                    // console.log('vpnAxiosRequest ok res2', res.data.data)
                    resolve(res && res.data && res.data.response);
                }
                console.log('vpnAxiosRequest success');
            })
                .catch(err => {
                reject(new Error(err));
                console.log('vpnAxiosRequest err', err);
            });
        }));
    });
}
exports.vpnAxiosRequest = vpnAxiosRequest;
function getOldestUsed() {
    const sorted = vpnData.filter((vpn) => vpn.alive).sort((a, b) => a.lastused - b.lastused);
    sorted[0].lastused = Date.now();
    return sorted[0].ip;
}
//# sourceMappingURL=project_file.js.map