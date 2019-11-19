import { expect } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import BetslipItem from '@/components/betslip/BetslipItem.vue'

import Bet from '@/models/bet'
import VueI18n from 'vue-i18n'
import { messages } from '@/translations/'
import globalMixin from '@/mixins/global'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueI18n)
localVue.mixin(globalMixin)

describe('BetslipItem component', () => {
  let store
  let actions
  let bet
  let wrapper
  let getters
  let mutations
  let state
  let i18n

  before(() => {
    state = {
      bets: [new Bet({
        id: null,
        eventId: '52908',
        marketStatus: 'active',
        eventName: 'Cameroon VS New Zealand',
        marketId: '7091092',
        marketName: '1x2',
        oddId: '25838157',
        oddName: 'New Zealand',
        stake: 5,
        status: 'initial',
        message: null,
        externalId: null,
        approvedOddValue: 3.48,
        currentOddValue: 3.50,
        success: null,
        oddChanged: false
      }),
      new Bet({
        id: null,
        eventId: '67890',
        marketStatus: 'inactive',
        eventName: 'Estonia vs Estonia',
        marketId: '0964783',
        marketName: '0',
        oddId: '24321142',
        oddName: 'Estonia',
        stake: 5,
        status: 'initial',
        message: null,
        externalId: null,
        approvedOddValue: 6.78,
        currentOddValue: 6.78,
        success: null,
        oddChanged: false
      })
      ]
    }

    bet = state.bets[0]

    getters = {
      getBets: () => state.bets,
      getBetsCount: () => state.bets.length,
      betslipSubmittable: () => true,
      getAnySubmittedBet: () => false,
      getAnyBetInValidation: () => false,
      getTotalStakes: () => 10,
      getTotalReturn: () => 15,
      acceptAllChecked: () => false,
      valuesUnconfirmed: () => true,
      getAnyFrozenBet: () => false,
      isBetDisabled: () => false
    }

    mutations = {
      updateBet: (bet) => {}
    }

    store = new Vuex.Store({
      modules: {
        betslip: {
          namespaced: true,
          state,
          actions,
          getters,
          mutations
        }
      }
    })

    i18n = new VueI18n({
      locale: 'en',
      messages
    })

    wrapper = shallowMount(BetslipItem, {
      propsData: {
        bet
      },
      store,
      localVue,
      i18n
    })
  })

  describe('initial state', () => {
    it('shows bet event name', () => {
      expect(wrapper.find('.event-name').text()).to.equal(bet.eventName)
    })

    it('shows bet market name', () => {
      expect(wrapper.find('.market-name').text()).to.equal(bet.marketName)
    })

    it('potential return has correct value', () => {
      const potentialRetunValue = (bet.stake * bet.approvedOddValue).toString()
      expect(wrapper.find('.potential-return').text()).to.equal(potentialRetunValue)
    })

    it('shows approved value', () => {
      expect(wrapper.find('.approved').text()).to.equal(bet.approvedOddValue.toString())
    })

    it('shows current value', () => {
      expect(wrapper.find('.current').text()).to.equal(bet.currentOddValue.toString())
    })

    it('dispatches remove odd method', () => {
      const removeOddStub = sinon.stub()
      wrapper.setMethods({ removeOdd: removeOddStub })
      wrapper.vm.removeOdd(bet.oddId)
      expect(removeOddStub.calledOnce).to.equal(true)
    })

    it('shows no alert messages on init state', () => {
      expect(wrapper.contains('.bet-message-alert')).to.equal(false)
    })

    it('shows no success alert messages on init state', () => {
      expect(wrapper.contains('.success-message')).to.equal(false)
    })

    it('shows no odd disabled alert messages on init state', () => {
      expect(wrapper.contains('.odd-disabled-message')).to.equal(false)
    })
  })

  describe('behaviour', () => {
    it('displays Odds changed alert when odds differ', () => {
      const wrapper = shallowMount(BetslipItem, {
        propsData: {
          bet
        },
        store,
        localVue,
        i18n
      })
      const message = 'Odds Changed'

      wrapper.vm.bet.oddChanged = true

      expect(wrapper.find('.alert-odds-changed').isVisible()).to.equal(true)
      expect(wrapper.find('.alert-odds-changed').text()).to.equal(message)
    })

    it('does not display Odds changed alert when odds are the same', () => {
      const market = { id: '7091092', odds: [{ id: '25838157' }] }
      const wrapper = shallowMount(BetslipItem, {
        propsData: {
          bet
        },
        store,
        localVue,
        i18n
      })

      wrapper.vm.bet.oddChanged = false

      wrapper.vm.updateOdds(market)

      expect(wrapper.find('.alert-odds-changed').isVisible()).to.equal(false)
    })
  })
})
