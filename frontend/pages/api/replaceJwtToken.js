// const ObjectId = require("mongo-objectid");
// const fs = require("fs");
// const jose = require("node-jose");
// const ms = require("ms");
// const jwt = require("jsonwebtoken");

// export default async function handler(req, res) {
//   let { token } = req.query;
//   // console.log("old token ", token);
//   if (!token) {
//     return res.status(400).send("Please pass token in request query");
//   }

//   // decode jwt token
//   const decoded = jwt.decode(token, { complete: true });
//   const userId = decoded.payload.uid;
//   if (!userId) {
//     return res.status(400).send("Please pass userId in token ");
//   }
//   const sub = decoded.payload.sub;
//   const appName = decoded.payload.appName;
//   if (sub !== "pubg-game-verifier" || appName !== "ludoKing") {
//     return res
//       .status(400)
//       .send("sub and appName field in provided jwtToken doesnt matches  ");
//   }

//   // ! important: Please create your own keys
//   const JWKeys = fs.readFileSync("keys.json");
//   const keyStore = await jose.JWK.asKeyStore(JWKeys.toString());
//   const [key] = keyStore.all({ use: "sig" });
//   const opt = { compact: true, jwk: key, fields: { typ: "jwt" } };
//   const payload = JSON.stringify({
//     exp: Math.floor((Date.now() + ms("1d")) / 1000),
//     iat: Math.floor(Date.now() / 1000),
//     sub: "pubg-game-verifier",
//     appName: "ludoKing", // appName : e.g ludo (should be provided by client itself during jwtToken generation of particular user)
//     // id: id.hex,
//     uid: userId,
//   });
//   const newToken = await jose.JWS.createSign(opt, key).update(payload).final();
//   // console.log("newToken ", newToken);
//   res.json(newToken,userId);
// }
