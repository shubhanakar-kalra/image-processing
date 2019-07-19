const { events, Job }  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")

  var job = new Job("lint-check", "node:8")

  job.tasks = [
    "cd src/",
    "npm i",
    "npm run eslint"
  ]
  job.run()
})
