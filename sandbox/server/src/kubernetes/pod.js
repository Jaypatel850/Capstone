import { k8sApi } from './config.js'

async function createPod (sandboxId) {
  if (!k8sApi) {
    throw new Error('Kubernetes API not initialized. Container must run inside a Kubernetes cluster.');
  }

  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: 'sandbox',
        sandboxId: sandboxId,
      },
    },
    spec: {
      volumes: [
        {
          name: 'workspace-volume',
          emptyDir: {}
        }
      ],
      initContainers: [{
        name:'init-container',
        image: 'template:latest',
        imagePullPolicy: 'IfNotPresent',
        command: ['sh', '-c', 'cp -r /workspace/. /seed/'],
        volumeMounts: [
          {
            name: 'workspace-volume',
            mountPath: '/seed'
          }
         ]
      }],
      containers: [
        {
          image: 'template:latest',
          imagePullPolicy: 'IfNotPresent',
          name: 'sandbox-container',
          ports: [
            {
              containerPort: 5173,
              name: 'http'
            }
           ],
          resources: {
            limits: {
              cpu: '500m',
              memory: '1Gi'
            },
            requests: {
              cpu: '250m',
              memory: '500Mi'
          }
        }

        },
        {
          image: 'agent:latest',
          imagePullPolicy: 'IfNotPresent',
          name: 'agent-container',
          ports: [
            {
              containerPort: 3000,
              name: 'http'
            }
          ],
          resources: {
            limits: {
              cpu: '500m',
              memory: '1Gi'
            },
            requests: {
              cpu: '250m',
              memory: '500Mi'
            }
          }
        }
      ]
    }
  }

  const response = await k8sApi.createNamespacedPod({
    namespace: 'default',
    body: podManifest
  });

  return response;

}

export default createPod;
