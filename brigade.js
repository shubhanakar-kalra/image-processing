const { events, Job }  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")

  var job = new Job("lint-check", "eslint:^6.0.1")

  job.tasks = [
    "npm i",
    "echo lint checked"
  ]
  job.run()
})