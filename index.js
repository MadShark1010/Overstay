const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');
const app = express();
app.use(middleware());

app.use((req, res, next) => {
    console.log("Incoming Request:", {
        headers: req.headers,
        body: req.body
    });
    next();
});

app.post('/timeframe', (req, res) => {
    const { envoy } = req;

    if (!envoy) {
        console.error("Envoy object is missing from request.");
        return res.sendFailed("Envoy object is missing.");
    }

    const timeMinutes = parseInt(envoy.payload?.timeMinutes, 10);

    if (isNaN(timeMinutes) || timeMinutes < 0 || timeMinutes > 180) {
        const message = "Invalid configuration. 'timeMinutes' must be a number between 0 and 180.";
        console.error(`${message}`);
        return res.sendFailed(message);
    }

    console.log(`Valid timeframe: ${timeMinutes} minutes`);

    res.send({ timeMinutes });
});

app.post('/visitor-sign-out', async (req, res) => {

    if (!req.envoy) {
        console.error("Error: Envoy data is missing.");
        return res.status(400).json({});
    }

    const {
        meta: { 
            config: { 
                timeMinutes, 
            }, 
        },
        payload: { 
            attributes: { 
                'full-name': visitorName, 
                'signed-in-at': signInTimeRaw, 
                'signed-out-at': signOutTimeRaw,
            } 
        },
        job,
    } = req.envoy;
    
    const signInTime = new Date(signInTimeRaw);
    const signOutTime = new Date(signOutTimeRaw);
    const maxAllowedMinutes = timeMinutes;

    const timeSpentMinutes = (signOutTime - signInTime) / (1000 * 60);

    console.log(`Visitor: ${visitorName}`);
    console.log(`Configured Max Time: ${maxAllowedMinutes} minutes`);
    console.log(`Sign-In Time: ${signInTime}`);
    console.log(`Sign-Out Time: ${signOutTime}`);
    
    let message;
    if (timeSpentMinutes > maxAllowedMinutes) {
        message = `${visitorName} overstayed the allotted time (${maxAllowedMinutes} minutes). Stayed for ${Math.round(timeSpentMinutes)} minutes.`;
    } else {
        message = `${visitorName} stayed within the allotted time (${maxAllowedMinutes} minutes). Stayed for ${Math.round(timeSpentMinutes)} minutes.`;
    }

    await job.attach({ label: 'Overstay Status', value: message });
    res.send({ message });
});

const listener = app.listen(process.env.PORT || 0, () => {
  console.log(`Listening on port ${listener.address().port}`);
});