const k8sApi = require('@kubernetes/client-node');

const kc = new k8sApi.KubeConfig();
kc.loadFromDefault();
const k8sCoreV1Api = kc.makeApiClient(k8sApi.CoreV1Api);

module.exports = {
	kc,
	k8sCoreV1Api,
};