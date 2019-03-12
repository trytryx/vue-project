import './assets/arcanefont.font'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vuejs-noty/dist/vuejs-noty.css'
import 'bootstrap'
import Vue from 'vue'
import VueNoty from 'vuejs-noty'
import App from './App'
import Router from '@/routes'
import apolloClient from '@/libs/apollo/'
import Store from '@/stores/index'
import globalMixin from '@/mixins/global'
import '@/components/global-components'
import VueApollo from 'vue-apollo'
import VueLogger from 'vuejs-logger'
import ContentfulPlugin from '@/libs/contentful/contentful-client'

const isProduction = process.env.NODE_ENV === 'production'

Vue.config.productionTip = false

Vue.mixin(globalMixin)

Vue.use(VueNoty, {
  timeout: 2000,
  layout: 'topRight'
})

Vue.use(VueApollo)
Vue.use(VueLogger, {
  logLevel: isProduction ? 'error' : 'debug'
})

Vue.use(ContentfulPlugin, {
  space: `${process.env.VUE_APP_CONTENTFUL_SPACE_ID}`,
  accessToken: `${process.env.VUE_APP_CONTENTFUL_ACCESS_TOKEN}`
})

const ApolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      loadingKey: 'loading'
    }
  }
})

new Vue({
  router: Router,
  store: Store,
  provide: ApolloProvider.provide(),
  render: h => h(App),
}).$mount('#app')
