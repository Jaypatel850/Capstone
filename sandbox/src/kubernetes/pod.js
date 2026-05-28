const { k8sCoreV1Api } = require("./config");

async function createPods(sandboxId) {
  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: "sandbox",
        sandboxId: sandboxId,
      },
    },
    spec: {
      containers: [
        {
          name: "sandbox-container",
          image: "template:latest",
          imagePullPolicy: "IfNotPresent",
          ports: [
            {
              containerPort: 5173,
            },
          ],
          resources: {
            limits: {
              cpu: "500m",
              memory: "500Mi",
            },
            requests: {
              cpu: "250m",
              memory: "250Mi",
            },
          },
        },
      ],
    },
  };

  try {
    const res = await k8sCoreV1Api.createNamespacedPod({
      namespace: "default",
      body: podManifest,
    });
    return res;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createPods,
};
