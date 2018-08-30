import graphqlClient from '@/libs/apollo'
import { WALLETS_LIST_QUERY } from './queries/wallets'

/**
 * Wallets store module
 */
export default {
  state: {
    wallets: [],
    activeWalletId: null
  },
  actions: {
    changeActiveWallet (context, walletId) {
      context.commit('setActiveWalletId', walletId)
      context.commit('resetBetslipStakes')
    },
    fetchWallets: async function ({ commit }, activeWallet = undefined) {
      console.log('making query')
      const response = await graphqlClient.query({
        query: WALLETS_LIST_QUERY,
        fetchPolicy: 'network-only'
      })

      console.log('getting response: ' + response.data.wallets)
      const wallets = response.data.wallets

      const activeWalletExists = activeWallet ? (wallets.find((wallet) => {
        return wallet.id === activeWallet.id
      })) : false
      const defaultActiveWallet = wallets[0]
      activeWallet = (activeWalletExists && activeWallet) ? activeWallet : defaultActiveWallet

      commit('storeWallets', { wallets: wallets, activeWallet: activeWallet })
    }
  },
  mutations: {
    storeWallets (state, { wallets, activeWallet }) {
      state.wallets = wallets
      state.activeWalletId = activeWallet.id
    },
    setActiveWalletId (state, id) {
      state.activeWalletId = id
    },
    clearWalletsStorage (state) {
      state.activeWalletId = null
      state.wallets = []
    }
  },
  getters: {
    getActiveWallet (state) {
      return state.wallets.find(el => el.id === state.activeWalletId)
    },
    getWallets (state) {
      return state.wallets
    }
  }
}
