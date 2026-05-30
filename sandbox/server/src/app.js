import express from 'express';
import morgan from 'morgan';
import { v7 as uuid } from 'uuid';
import createPod from './kubernetes/pod.js';
import { createService } from './kubernetes/service.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/sandbox/health', (req, res) => {
    res.status(200).json({
        message: 'Sandbox API is healthy',
        status: 'ok'
    });
});

app.post('/api/sandbox/start', async (req, res) => {
    const sandboxId = uuid();
    try {
        if (!createPod || !createService) {
            throw new Error('Kubernetes client not available. Run this container inside a Kubernetes cluster.');
        }
        
        await Promise.all([
            createPod(sandboxId),
            createService(sandboxId),
        ]);

        return res.status(201).json({
            message: 'Sandbox environment created successfully',
            sandboxId,
            previewUrl: `http://${sandboxId}.preview.localhost`
        });
    } catch (err) {
        console.error('Failed to create sandbox:', err);
        return res.status(500).json({ 
            error: 'Failed to create sandbox',
            details: err.message
        });
    }
});


export default app;