import loginRoutes from './loginRoutes';
import usersRoutes from './usersRoutes';
import profilesRoutes from './profilesRoutes';


import LySPA from '../layouts/LySPA.vue';
import Home from '../views/Home/Home.vue';
import ConfigureAccount from '../views/Account/ConfigureAccount.vue';
import chatRoutes from './chatRoutes';



export default [
    {
        path: '*',
        redirect: '/login'
    },
    loginRoutes,
    {
        path: '/',
        components: {
            allPageView: LySPA
        },
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                name: 'home',
                path: '',
                components: {
                    sectionView: Home
                }
            },
            {
                name: 'home.account',
                path: 'account',
                components: {
                    sectionView: ConfigureAccount
                }
            },
            usersRoutes,
            profilesRoutes,
            chatRoutes
        ]
    }
]