
import LyAuth from '../layouts/LyAuth.vue';
import Login  from '../views/Auth/Login.vue';
import ForgotPassword from '../views/Auth/ForgotPassword.vue';
import ResetPassword from '../views/Auth/ResetPassword.vue';
import SetInitialPassword from '../views/Auth/SetInitialPassword.vue';
import VerifyEmail from '../views/Auth/VerifyEmail.vue';

export default {
    path: '/login',
    components: {
        allPageView: LyAuth
    },
    children: [
        {
            name: 'login',
            path: '',
            components: {
                sectionView: Login
            }
        },
        {
            name: 'forgotPassword',
            path: '/forgot-password',
            components: {
                sectionView: ForgotPassword
            }
        },
        {
            name: 'resetPassword',
            path: '/reset-password/:token',
            components: {
                sectionView: ResetPassword
            }
        },
        {
            name: 'enrollAccount',
            path: '/enroll-account/:token',
            components: {
                sectionView: SetInitialPassword
            }
        },
        {
            name: 'verifyEmail',
            path: '/verify-email/:token',
            components: {
                sectionView: VerifyEmail
            }
        },
    ]
}
