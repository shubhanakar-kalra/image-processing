const { events, Job , Group}  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")
  let group = new Group();
  let job = new Job("lint-check", "node:8")

  job.tasks = [
    "cd src/",
    "npm i"
      ]
  //job.run()
  group.add(job);
  console.log("Job successfuly ran")
  let job2 = new Job("Dockerization", "docker:18.09")

  job2.tasks = [
    "workdir /app",
    "npm i"
  ]
  group.add(job2);
  group.runEach([job],[job2]);
  //job2.run()

})
