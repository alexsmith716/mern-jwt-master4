
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
import Home from './Home.js';
import Signup from './Signup.js';
import Signin from './Signin.js';
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default {
    routes: [
        {
            path: '/',
            component: Home,
            exact: true
        },
        {
            path: '/signup',
            component: Signup,
            exact: true
        },
        {
            path: '/signin',
            component: Signin,
            exact: true
        },
    ]
} 