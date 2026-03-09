import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.post('/login', [controllers.Auth, 'login'])
router.post('/purchase', [controllers.Transactions, 'purchase'])

router
  .group(() => {
    router.get('/transactions', [controllers.Transactions, 'index'])
    router.get('/transactions/:id', [controllers.Transactions, 'show'])
    router
      .group(() => {
        router.post('/transactions/:id/refund', [controllers.Transactions, 'refund'])
      })
      .use(middleware.role(['ADMIN', 'FINANCE']))

    router
      .group(() => {
        router.get('/products', [controllers.Products, 'index'])
        router.post('/products', [controllers.Products, 'store'])
        router.get('/products/:id', [controllers.Products, 'show'])
        router.put('/products/:id', [controllers.Products, 'update'])
        router.delete('/products/:id', [controllers.Products, 'destroy'])
      })
      .use(middleware.role(['ADMIN', 'MANAGER', 'FINANCE']))

    router
      .group(() => {
        router.get('/users', [controllers.Users, 'index'])
        router.post('/users', [controllers.Users, 'store'])
        router.get('/users/:id', [controllers.Users, 'show'])
        router.put('/users/:id', [controllers.Users, 'update'])
        router.delete('/users/:id', [controllers.Users, 'destroy'])
      })
      .use(middleware.role(['ADMIN', 'MANAGER']))

    router.get('/clients', [controllers.Clients, 'index'])
    router.get('/clients/:id', [controllers.Clients, 'show'])

    router
      .group(() => {
        router.get('/gateways', [controllers.Gateways, 'index'])
        router.patch('/gateways/:id/toggle', [controllers.Gateways, 'toggle'])
        router.patch('/gateways/:id/priority', [controllers.Gateways, 'updatePriority'])
      })
      .use(middleware.role(['ADMIN']))
  })
  .use(middleware.auth())
