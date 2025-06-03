const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Optional: use a shared secret to authenticate requests from Okta
//const SHARED_SECRET = 'your-secret-key'; // Replace or remove if not using authentication

app.use(bodyParser.json());

app.post('/okta-events', (req, res) => {
    // Optional: Authenticate the request
    // const authHeader = req.headers['authorization'];
    // if (SHARED_SECRET && authHeader !== `Bearer ${SHARED_SECRET}`) {
    //     console.log('Unauthorized request received');
    //     return res.status(401).send('Unauthorized');
    // }

    const body = req.body;

    // Handle verification challenge from Okta
    if (body && body.verification) {
        console.log('Received verification request from Okta');
        return res.status(200).json({ verification: body.verification });
    }

    // Handle actual event notifications
    console.log('Received Okta Event:', JSON.stringify(body, null, 2));

    // Always respond with 200 OK so Okta doesn't retry
    res.status(200).send();
});

app.listen(PORT, () => {
    console.log(`✅ Okta Event Hook server running at http://localhost:${PORT}/okta-events`);
});
