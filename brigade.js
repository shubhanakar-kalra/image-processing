const { events }  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")
})
