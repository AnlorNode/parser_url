
const { parentPort, workerData } = require('worker_threads');
const request = require("request");
(async () => {
    const response = await Promise.all(workerData.map((url) =>
        new Promise((resolve, reject) => request.get(url, (err, resp) => {
            if (err) {
                console.error(err);
                
                return reject(err);
            }
      
            resolve(resp.body)
        })
        )
    ));
    parentPort.postMessage({ response })
})()


