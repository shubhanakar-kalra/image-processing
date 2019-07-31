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
  job2.env = {
    DOCKER_DRIVER: "overlay",
    TYPE: project.secrets.type,
    PROJECT_ID: project.secrets.project_id,
    PRIVATE_KEY_ID: project.secrets.private_key_id,
    PRIVATE_KEY: project.secrets.private_key_id,
    CLIENT_EMAIL: project.secrets.client_email,
    CLIENT_ID: project.secrets.client_id,
    AUTH_URI: project.secrets.auth_uri,
    TOKEN_URI: project.secrets.token_uri,
    AUTH_PROVIDER_X509_CERT_URL: project.secrets.auth_provider_x509_cert_url,
    CLIENT_X509_CERT_URL: project.secrets.client_x509_cert_url
  }


  job2.tasks = [
    "cd src",
    "ls -lart",
    //"echo $TYPE",
    //`echo ${project.secrets.type}`
    "dockerd-entrypoint.sh &",
    "sleep 10",
    "export SKIP_PREFLIGHT_CHECK=true",
    "echo '{type: ${TYPE}, project_id: ${PROJECT_ID} }' > echo key.json",
    "cat $key.json",
    "docker login -u _json_key --password-stdin https://gcr.io",
    // "docker build -t gcr.io/fluted-bit-244912/shaxxz13/shubhuxx . ",
    // "docker push gcr.io/fluted-bit-244912/shaxxz13/shubhuxx"
    // "docker pull google/cloud-sdk:latest",
    // "docker run google/cloud-sdk:latest gcloud version",
    // "gcloud auth activate-service-account --key-file=keys.json"
    // "docker login -u shaxxz13 -p shubhu9797",
    // "docker push shaxxz13/shubhuxx"
  ]
  //job.run().then(() => {
  job2.run()
  //})






})



