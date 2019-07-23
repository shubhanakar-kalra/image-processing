const { events, Job }  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")

  var job = new Job("lint-check", "node:8")

  job.tasks = [
    "cd src/",
    "npm i"
      ]
  job.run()
  console.log("Job successfuly ran")
  var job2 = new Job("Dockerization", "docker:18.09")

  job2.tasks = [
    "workdir /app",
    "npm i"
  ]
  job2.run()
})
