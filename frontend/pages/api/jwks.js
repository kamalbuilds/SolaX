import path from "path";

const fs = require("fs");
const jose = require("node-jose");

export default async function handler(req, res) {
    const file = path.join(process.cwd(), 'keys.json');
    const ks = fs.readFileSync(file);
    const keyStore = await jose.JWK.asKeyStore(ks.toString());
    res.send(keyStore.toJSON());
}