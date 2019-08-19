const { events, Job, Group }  = require("brigadier")

events.on("push", (_, project) => {
  console.log("==> handling an 'push' event")
  let job = new Job("lint-check", "node:8")
  job.storage.enabled = true
  job.tasks = [
    "cd src/",
    "npm i",
    "npm i -g eslint",
    "chmod u+x ./gitversion",
    "./gitversion > /mnt/brigade/share/gitteah.txt",
    "eslint --init"
  ]


  let job1 = new Job("docker", "docker:stable-dind")
  job1.storage.enabled = true
  job1.privileged = true;
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
  var verr = "0.0.5";
  job1.env = {
    DOCKER_DRIVER: "overlay",
    KEYS: JSON.stringify(keysvalue),
    ver: verr
  }
  job1.tasks = [
    "cd src",
    "ls -lart",
    "apk add figlet",
    "dockerd-entrypoint.sh &",
    "sleep 10",
    "export SKIP_PREFLIGHT_CHECK=true",
    "apk add git",
    "figlet SEMVER",
    //"cat /mnt/brigade/share/gitteah.txt",
    "chmod u+x ./gitversion",
    "git fetch --tags -q",
    "./gitversion  bump auto && ./gitversion show > pipeline_app_version.txt",
    "cat pipeline_app_version.txt > version",

    //"wget -q -O gitversion https://github.com/screwdriver-cd/gitversion/releases/download/v1.1.1/gitversion_linux_amd64",
    // "chmod u+x ./gitversion",
    // "git fetch --tags -q",
    // "./gitversion  bump auto && ./gitversion show > pipeline_app_version.txt",
    // "cat pipeline_app_version.txt > version",
    // // "echo $KEYS",
    "echo ${KEYS} >> keys.json",
    "cat keys.json > /mnt/brigade/share/keys.json",
    "cat keys.json | docker login -u _json_key --password-stdin  https://gcr.io",
    

  ]
let job2 = new Job("self", "dhirwanashish/asd-devops:v1")
job2.env = {
  DOCKER_DRIVER: "overlay",
 
}
job2.storage.enabled = true
job2.privileged = true;
job2.tasks = [
    "cd /mnt/brigade/share",
    "cd /src",
    "dockerd-entrypoint.sh &",
    "gcloud auth configure-docker",
    "apk add figlet",
    "gcloud auth activate-service-account --key-file=/mnt/brigade/share/keys.json", 
    "gcloud config set project fluted-bit-244912",   
    "figlet AUTH",
    "figlet RB check  grep",
    "gcloud info | grep Account",
    "figlet SET PROJECT",
    "kubectl config view",
    "figlet CONFIG",
    "docker login -u shaxxz13 -p shubhu9797",
    "figlet Docker login",
    "helm init --history-max 200",
    // "kubectl create serviceaccount --namespace kube-system tiller",
    // "kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller",
    // "helm ls",
      //"docker build -t gcr.io/fluted-bit-244912/shaxxz13/shubhuxx . ",
      // "docker push gcr.io/fluted-bit-244912/shaxxz13/shubhuxx",
    "figlet Image Push Successful"
]

  Group.runEach([job1, job2])

})
