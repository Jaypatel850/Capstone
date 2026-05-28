const express = require('express');
const morgan = require('morgan');
const app = express();
const { createPods } = require('./kubernetes/pod');
const { serviceManifest } = require('./kubernetes/service');
const { k8sCoreV1Api } = require('./kubernetes/config');
const { v7:uuid } = require('uuid');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api/sandbox/health', (req, res) => {
    res.status(200).json("Sandbox is healthy");
});
app.post('/api/sandbox/create', async (req, res) => {
    const sandboxId = uuid();
    try {
        Promise.all([
            createPods(sandboxId),
            k8sCoreV1Api.createNamespacedService({
                namespace: "default",
                body: serviceManifest(sandboxId),
            }),
        ]);
        res.status(200).json({ sandboxId, previewUrl: `http://sandbox-service-${sandboxId}.preview.localhost` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create sandbox" });
    }
});
module.exports = app;