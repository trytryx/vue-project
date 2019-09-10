import Router from 'vue-router'
import mainRoutes from './main'
import StyleGuidePages from './styleguide_pages'
import InformationPages from '@/routes/information_pages'
import NotFound from '@/views/layouts/common/NotFound'
import Maintenance from '@/views/layouts/common/Maintenance'
import { setCookie } from '@/helpers/cookies'
import moment from 'moment'
import filters from '@/mixins/filters'
import { colors } from '@/constants/android-theme-colors'

const rootChildren = [...mainRoutes, ...InformationPages.routes]

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/styleguide',
      name: 'styleguide',
      redirect: 'styleguide/typography',
      component: () => import('@/views/styleguide/Page'),
      children: StyleGuidePages
    },
    {
      path: '/',
      redirect: '/esports',
      name: 'home',
      component: () => import('@/views/layouts/common/Layout'),
      children: rootChildren
    },
    {
      path: 'maintenance',
      name: 'Maintenance',
      component: Maintenance
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: NotFound
    },
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      const container = document.documentElement
      const position = savedPosition || { x: 0, y: 0 }

      setTimeout(() => {
        container.scrollTo(position.x, position.y)
        resolve()
      }, 1)
    })
  }
})

router.beforeEach((to, from, next) => {
  if (to.params.titleKind) {
    document.title = `${filters.capitalizeFirstLetter(to.params.titleKind)} - Arcanebet`
  }

  const section = to.meta.themeColor || to.params.titleKind
  if (section) {
    const newColor = colors[section.toString()]
    const themeColor = document.querySelector('meta[name=theme-color]')
    themeColor.setAttribute('content', newColor)
  }

  if (to.query.btag) { setCookie('btag', to.query.btag, moment().add(1, 'month').toDate()) }
  next()
})

export default router
