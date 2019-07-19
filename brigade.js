const { events, Job }  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")

  var job = new Job("lint-check", "alpine:3.4")

  job.tasks = [
    "npm i",
    "eslint --fix ."
  ]
  job.run()
})