const serviceManifest = (sandboxId) => ({
  metadata: {
    name: `sandbox-service-${sandboxId}`,
    labels: {
      app: "sandbox",
      sandboxId: sandboxId,
    },
  },
  spec: {
    selector: {
      app: "sandbox",
      sandboxId: sandboxId,
    },
    ports: [
      {
        name: "http",
        protocol: "TCP",
        port: 5173,
        targetPort: 5173,
      },
    ],
    type: "ClusterIP",
  },
}
);

module.exports = {
  serviceManifest,
};
