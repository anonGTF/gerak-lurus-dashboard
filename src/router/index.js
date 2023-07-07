import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AnswerListView from '@/views/AnswerListView.vue'
import ExamView from '@/views/ExamView.vue'
import MaterialView from '@/views/MaterialView.vue'
import QuizView from '@/views/QuizView.vue'
import { getCurrentUser } from "@/firebase"

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/BJqIzJc07Pzgcxh6AnZP',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/',
        component: DashboardLayout,
        meta: { requireAuth: true },
        children: [
            {
                path: '/',
                name: 'Home',
                component: AnswerListView
            },
            {
                path: 'quiz',
                name: 'Quiz',
                component: QuizView
            },
            {
                path: 'material',
                name: 'Material',
                component: MaterialView
            },
            {
                path: 'exam',
                name: 'Exam',
                component: ExamView
            },
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: import.meta.env.BASE_URL,
    routes
})

router.beforeEach(async (to, from, next) => {
    let user = await getCurrentUser()
    if (to.matched.some(record => record.meta.requireAuth)) {
        if (user != null) {
            next()
        } else {
            next({ name: 'login' })
        }
    } else {
        next()
    }
})

Vue.use(VueRouter)

export default router