const { events, Job } = require("brigadier")

events.on("push", (_, project) => {
  console.log("==> handling an 'push' event")
  let job = new Job("lint-check", "node:8")

  job.tasks = [
    "cd src/",
    // "npm i"
    "ls -lart"
  ]

  let job2 = new Job("docker", "docker:stable-dind")
  job2.privileged = true;
  var keysvalue = {
    type: project.secrets.type,
    project_id: project.secrets.project_id,
    private_key_id: project.secrets.private_key_id,
    private_key: project.secrets.private_key,
    client_email: project.secrets.client_email,
    client_id: project.secrets.client_id,
    auth_uri: project.secrets.auth_uri,
    token_uri: project.secrets.token_uri,
    auth_provider_x509_cert_url: project.secrets.auth_provider_x509_cert_url,
    client_x509_cert_url: project.secrets.client_x509_cert_url
  }

  job2.env = {
    DOCKER_DRIVER: "overlay",
    KEYS: JSON.stringify(keysvalue)   
  }
  job2.tasks = [
    "cd src",
    "ls -lart",
    "dockerd-entrypoint.sh &",
    "sleep 10",
    "export SKIP_PREFLIGHT_CHECK=true",
    "echo $KEYS",
    "echo ${KEYS} >> keys.json",
    "cat keys.json | docker login -u _json_key --password-stdin  https://gcr.io",
    "docker build -t gcr.io/fluted-bit-244912/shaxxz13/shubhuxx . ",
    "docker push gcr.io/fluted-bit-244912/shaxxz13/shubhuxx"
    

  ]

  //job.run().then(() => {
  job2.run()
  //})

})



