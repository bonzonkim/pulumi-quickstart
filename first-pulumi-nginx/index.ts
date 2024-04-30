import * as k8s from "@pulumi/kubernetes";

const appLabels = { app: "nginx" };
const appName = "nginx";

const deployment = new k8s.apps.v1.Deployment(appName, {
  metadata: { namespace: "test" },
    spec: {
        selector: { matchLabels: appLabels },
        replicas: 1,
        template: {
            metadata: { labels: appLabels, namespace: "test" },
            spec: { containers: [{ name: "nginx", image: "nginx" }] }
        }
    }
});

const service = new k8s.core.v1.Service(appName, {
  metadata: {
    name: "svc-nginx",
    namespace: "test",
    labels: appLabels
  },
  spec: {
    type: "NodePort",
    ports: [{
      port: 80,
      targetPort: 80,
      nodePort: 30020
    }],
    selector: appLabels
  },
});
