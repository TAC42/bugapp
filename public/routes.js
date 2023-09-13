import {HomePage} from './views/HomePage.jsx'
import {AboutUs} from './views/AboutUs.jsx'
import {BugIndex} from './views/BugIndex.jsx'
import {BugDetails} from './views/BugDetails.jsx'
import { BugEdit } from './views/BugEdit.jsx'

export default [
    {
        path:'/',
        component: HomePage,
    },
    {
        path:'/bug',
        component: BugIndex,
    },
    {
        path:'/bug/:bugId',
        component: BugDetails,
    },
    {
        path:'/about',
        component: AboutUs,
    },
    {
        path:'/bug/edit',
        component: BugEdit,
    },
    {
        path:'/bug/edit/:bugId',
        component: BugEdit,
    }
]