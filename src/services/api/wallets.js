import BaseService from './base-service'

class WalletsService extends BaseService {
  loadList (fields = '', prop = 'wallets') {
    return new Promise((resolve, reject) => {
      this.client.addSmartQuery(prop, {
        query: this.buildQuery(`
          query {
            wallets {
              ${fields}
            }
          }
        `),
        fetchPolicy: 'network-only',
        result: resolve,
        error: reject
      })
    })
  }
}

export default WalletsService
