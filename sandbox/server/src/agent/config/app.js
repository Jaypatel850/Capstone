const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const WORK_DIR = '/workspace';
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.get('/',(req, res) => {
    res.json({ message: 'Hello World!' },
        status(200)
    );
});
app.get('/list-files', async (req, res) => {
    const files = await fs.promises.readdir(WORK_DIR);
    res.json({ files }, status(200));
});
export default app;