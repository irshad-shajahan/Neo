const crypto = require('crypto');

function generateSignature(merchantTxnId, request) {
    const secret_key = "***YourSecretKey***"; // Replace with your actual secret key
    const accesskey = "***YourAccessKey***"; // Replace with your actual access key
    const txn_id = merchantTxnId; // Unique transaction ID
    const amount = "1.00"; // Transaction amount

    const data = `merchantAccessKey=${accesskey}&transactionId=${txn_id}&amount=${amount}`;

    const hmac = crypto.createHmac('sha1', secret_key);
    hmac.update(data);
    return hmac.digest('hex');
}

// module.exports = generateSignature

//================================================================================================

const { Juspay, APIError } = require('expresscheckout-nodejs')
const fs = require('fs');


const SANDBOX_BASE_URL = "https://smartgatewayuat.hdfcbank.com"
const PRODUCTION_BASE_URL = "https://smartgateway.hdfcbank.com"
const config = require('./config.json')
const path = require('path')
// const publicKey = fs.readFileSync(config.PUBLIC_KEY_PATH)
// const privateKey = fs.readFileSync(config.PRIVATE_KEY_PATH)
// const paymentPageClientId = config.PAYMENT_PAGE_CLIENT_ID
const configPath = path.resolve(__dirname, './config.json'); 
const configDir = path.dirname(configPath);

// Adjust paths to be absolute based on the config file's directory
config.PRIVATE_KEY_PATH = path.join(configDir, config.PRIVATE_KEY_PATH);
config.PUBLIC_KEY_PATH = path.join(configDir, config.PUBLIC_KEY_PATH);

// Now read the files using the adjusted paths
const publicKey = fs.readFileSync(config.PUBLIC_KEY_PATH, 'utf8');
const privateKey = fs.readFileSync(config.PRIVATE_KEY_PATH, 'utf8');


const juspay = new Juspay({
    merchantId: config.MERCHANT_ID,
    baseUrl: PRODUCTION_BASE_URL,
    jweAuth: {
        keyId: config.KEY_UUID,
        publicKey,
        privateKey
    }
})

module.exports = juspay