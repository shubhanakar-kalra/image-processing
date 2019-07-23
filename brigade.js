const { events, Job }  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")
  //let group = new Group();
  //let job = new Job("lint-check", "node:8")

  //job.tasks = [
   // "cd src/",
//"npm i"
    //  ]
 
  
  let job2 = new Job("dockerization", "docker:stable-dind")

  job2.tasks = [
    "workdir /app",
    "ls -lart"
  ]
 job2.run();

})
