const cluster = require("cluster");
const cpuCount = require("os").cpus().length;



if (cluster.isMaster) {
  masterProcess()
} else {
  childProcess()
}

function masterProcess() {
  console.log(`Master process ${process.pid} is running`)
  //fork workers.
  for (let i = 0; i < cpuCount; i++) {
    console.log(`Forking process number ${i}...`)
    cluster.fork() //creates new node js processes
  }
  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.process.pid} died`)
    cluster.fork() //forks a new process if any process dies
  })
}



function childProcess() {
  require('./api')
}