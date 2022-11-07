import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter({
  routes: [
    {
      path: '/tet',
      component: <div>Hello world!</div>,
    },
    // {
    //   path: '/register',
    //   component: Register,
    // },
    // {
    //   path: '/login',
    //   component: Login,
    // },
  ],
})

export default router
