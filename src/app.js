const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");
const C = require("fxjs/Concurrency");
const axios = require("axios");

const axiosRequest = (method, url, data) => {
    return axios({
        method,
        url: "http://localhost:9000/send",
        data,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
};

const request = async (before) => {
    try {
        return await axiosRequest('get')
            .then(_ => {
                console.log(_.data - before)
            })
    } catch (e) {
        console.log(e);
        return null;
    }
};

async function job() {
    var date = Date;
    await _.go(
        L.range(500),
        L.map(_ => {
            try {
                return request(date.now())
            } catch (e) {
                return "fuck";
            }
        }),
        // L.map(console.log),
        C.takeAll
    );
}

// time(ms) 주기로 같은 작업을 반복하도록 재귀처리
(function recur() {
    Promise.all([
        _.delay(1000, undefined),
        job(),
        console.log("===================================================")
    ]).then(recur);
})();
