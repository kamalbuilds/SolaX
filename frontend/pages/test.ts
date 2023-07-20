import { Connection , PublicKey } from '@solana/web3.js'
import { PriceStatus, PythHttpClient, getPythClusterApiUrl, getPythProgramKeyForCluster, PythCluster } from '@pythnetwork/client'

const PYTHNET_CLUSTER_NAME: PythCluster = 'pythnet'
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME))
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME)

async function runQuery(): Promise<void> {
  const feeds = [new PublicKey('H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG')]
  const pythClient = new PythHttpClient(connection, pythPublicKey , feeds)
  const data = await pythClient.getData()

  for (const symbol of data.symbols) {
    const price = data.productPrice.get(symbol)!

    if (price.price && price.confidence) {
      // tslint:disable-next-line:no-console
      console.log(`${symbol}: $${price.price} \xB1$${price.confidence}`)
    } else {
      // tslint:disable-next-line:no-console
      console.log(`${symbol}: price currently unavailable. status is ${PriceStatus[price.status]}`)
    }
  }
}

runQuery()