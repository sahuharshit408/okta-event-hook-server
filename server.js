const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

const SHARED_SECRET = process.env.SHARED_SECRET;

// Optional: use a shared secret to authenticate requests from Okta
//const SHARED_SECRET = 'your-secret-key'; // Replace or remove if not using authentication
console.log(`!!!!!!!!!!!!!!!!!!!!!!!! I got the Shared Secrest as `+SHARED_SECRET);
app.use(bodyParser.json());

app.get('/okta-events', (req, res) => {
  const verification = req.headers['x-okta-verification-challenge'];
  if (verification) {
    res.status(200).json({ verification });
  } else {
    res.status(400).send('Missing verification challenge');
  }
});

app.post('/okta-events', (req, res) => {
    //Authenticate the request
    const authHeader = req.headers['authorization'];
    
    console.log('Authorization Header:', req.headers['authorization']);

    if (SHARED_SECRET && authHeader !== `Bearer ${SHARED_SECRET}`) {
        console.log('Unauthorized request received');
        return res.status(401).send('Unauthorized');
    }
    
    console.log('\n=== Incoming Request from Okta ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    

    const body = req.body;

    // Handle verification challenge from Okta
    if (body && body.verification) {
        console.log('Received verification request from Okta');
        return res.status(200).json({ verification: body.verification });
    }

    // Handle actual event notifications
    console.log('Received Okta Event:', JSON.stringify(body, null, 2));
    
    console.log(`Success!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1`);

    // Always respond with 200 OK so Okta doesn't retry
    res.status(200).send();
});

app.use((req, res) => {
  console.log(`Unmatched request: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`✅ Okta Event Hook server running at http://localhost:${PORT}/okta-events`);
});
