# Overstay

Overstay is an Envoy integration that tracks visitor sign-in and sign-out times to determine if they have exceeded their allotted duration.

### Features:

✅ Tracks visitor sign-in and sign-out timestamps
✅ Validates against a configurable time limit
✅ Attaches overstay status to the visitor record in Envoy

### Setup:

Install dependencies:

```sh
npm install
```

Create a .env file and add the following:

```sh
PORT=3000
ENVOY_CLIENT_ID=<your-envoy-client-id>
ENVOY_CLIENT_SECRET=<your-envoy-client-secret>
```

Replace the last two values with your own from your Envoy Developer App setup.

Start the server:

```sh
node index.js
```

### Configuration:

Set the timeMinutes value in the Envoy setup
Ensure the webhook endpoints are correctly configured