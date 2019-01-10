import EventsList from '@/views/events-list/Page.vue'
import arcanebetSession from '@/services/local-storage/session'

export default [
  {
    path: 'live',
    name: 'live',
    component: () => import('@/views/live/Page')
  },
  {
    path: ':titleKind',
    component: () => import('@/views/layouts/main/Content'),
    children: [
      {
        path: '',
        name: 'title-kind',
        component: EventsList
      },
      {
        path: 'title/:titleId',
        name: 'title',
        component: EventsList
      },
      {
        path: 'title/:titleId/tour/:tournamentId',
        name: 'tournament',
        component: EventsList
      }
    ]
  },
  {
    path: 'outright',
    name: 'outright',
    component: () => import('@/views/outrights/Page'),
  },
  {
    path: 'activation/:token',
    name: 'activation',
    component: () => import('@/views/auth/Activation')
  },
  {
    path: 'event/:id',
    name: 'event',
    component: () => import('@/views/event/Page'),
    props: true
  },
  {
    path: 'impersonate/:token',
    beforeEnter: (to, from, next) => {
      const customerAttrs = JSON.parse(to.query.customer)
      arcanebetSession.storeImpersonatedSession(to.params.token, customerAttrs)
      next({ path: '/' })
    }
  }
]
