const { events, Job }  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")
 // let group = new Group();
 // let job = new Job("lint-check", "node:8")

  //job.tasks = [
   //"cd src/",
    //"npm i"
     // ]
  let job2 = new Job("dockerization", "docker:stable-dind")
  job2.privileged = true;
  job2.env = {
    DOCKER_DRIVER: "overlay"
  }
  job2.tasks = [
    //"mkdir /app",
    "cd src",
    "ls -lart",
    "dockerd-entrypoint.sh &",
    "sleep 20",
    "export SKIP_PREFLIGHT_CHECK=true",
    "docker build -t shaxxz13/shubhuproc . ",
  ]
  job2.run();
  //job.run();

})

