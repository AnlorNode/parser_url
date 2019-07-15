const { Worker, isMainThread, parentPort } = require('worker_threads');
//const deleteStrimTurn = () => delete strim_turn[Object.keys(strim_turn)[0]]

function startWorker({ path, res, workerData }, error) {
  let w = new Worker(path, { workerData });
  w.on('message', (dat) => {
    res(dat)
  })
  w.on('error', (err) => {
    error(err)
  });
  w.on('exit', (code) => {
    if (code != 0) {
      error(`Worker stopped with exit code ${code}`)
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
  return w;
}

module.exports = (data) => {
  const buf = {}
  const arr = Array(8).fill().map(() => [])
  data.forEach(el => {
    arr.forEach((a, b) => {
      if (!buf[el]) {
        buf[el] = true
        arr[b].push(el)
      }
    })
  });

  return Promise.all(arr.map((a, b) =>
    new Promise((res, error) => {
      if (arr[b][0]) {
        startWorker({
          res,
          path: `${__dirname}/workerCode.js`,
          workerData: arr[b]
        }, error)
      } else {
        res()
      }

    })
  )
  )
}
