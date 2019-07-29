const { events, Job }  = require("brigadier")

events.on("push", () => {
  console.log("==> handling an 'push' event hello to bald")
 //let group = new Group();
  let job = new Job("lint-check", "node:8")

  job.tasks = [
   "cd src/",
    "npm i"
]

  let job2 = new Job("docker", "docker:stable-dind")
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
    "VERSION=1.5.0",
    "OS=linux",
    "ARCH=amd64",
    "curl -fsSL `https://github.com/GoogleCloudPlatform/docker-credential-gcr/releases/download/v${VERSION}/docker-credential-gcr_${OS}_${ARCH}-${VERSION}.tar.gz` \
    | tar xz --to-stdout ./docker-credential-gcr \
    > /usr/bin/docker-credential-gcr && chmod +x /usr/bin/docker-credential-gcr",
    // "apk add curl",
    // "curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz",
    // "mkdir -p /usr/local/gcloud",
    "docker-credential-gcr gcr-login > log.txt",
    "echo ======================================",
    "cat log.txt"
    // "tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz",
    // "echo ++++++++++++++++++++++++++++++++++++++++++",
    // "/usr/local/gcloud/google-cloud-sdk/install.sh",
    // "/usr/local/gcloud/google-cloud-sdk/bin/gcloud init"


    // "cat keys.json | docker login -u _json_key --password-stdin https://gcr.io",
    // "docker build -t gcr.io/fluted-bit-244912/shaxxz13/shubhuxx . ",
    // "docker push gcr.io/fluted-bit-244912/shaxxz13/shubhuxx"
    //"docker pull google/cloud-sdk:latest",
    //"docker run google/cloud-sdk:latest gcloud version",
    //"gcloud auth activate-service-account --key-file=keys.json"
    //"docker login -u shaxxz13 -p shubhu9797",
    //"docker push shaxxz13/shubhuxx"
  ]
  //job.run().then(() => {
    job2.run()
  //})

  




})



