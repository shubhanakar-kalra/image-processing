const { events, Job }  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")
 //let group = new Group();
  let job = new Job("lint-check", "node:8")

  job.tasks = [
   "cd src/",
    "npm i"
      ]
  let job2 = new Job("dockerization", "docker:stable-dind")
  job2.privileged = true;
  job2.env = {
    DOCKER_DRIVER: "overlay"
  }
  
  job2.tasks = [

    "cd src",
    "ls -lart",
    "dockerd-entrypoint.sh &",
    "sleep 10",
    "export SKIP_PREFLIGHT_CHECK=true",
    //"docker build -t shaxxz13/shubhuxx . ",
    "docker pull google/cloud-sdk:latest",
    "docker run google/cloud-sdk:latest gcloud version",
    "gcloud auth activate-service-account --key-file=keys.json"
   // "docker login -u shaxxz13 -p shubhu9797",
    //"docker push shaxxz13/shubhuxx"
  ]
  //job.run().then(() => {
    job2.run()
  //})
//hello
  




})



