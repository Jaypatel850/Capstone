import { k8sApi } from './config.js';

export const createService = async (sandboxId) => {
    if (!k8sApi) {
        throw new Error('Kubernetes API not initialized. Container must run inside a Kubernetes cluster.');
    }

    const serviceManifest = {
        metadata: {
            name: `sandbox-service-${sandboxId}`,
            labels: {
                app: 'sandbox',
                sandboxId: sandboxId
            }
        },
        spec: {
            selector: {
                app: 'sandbox',
                sandboxId: sandboxId
            },
            ports: [
                {
                    name: "http",
                    port: 80,
                    targetPort: 5173,
                    protocol: "TCP"
                },
                {
                    name: "agent-http",
                    port: 3000,
                    targetPort: 3000,
                    protocol: "TCP"
                }
            ],
            type: "ClusterIP"
        }
    }

    const response = await k8sApi.createNamespacedService({
        namespace: 'default',
        body: serviceManifest
    })

    return response;
}
