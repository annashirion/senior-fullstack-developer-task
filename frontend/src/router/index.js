import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import store from "../store"
import { UserStatus } from "../enums/user-status.enum"

const routes = [
	{
		path: "/",
		name: "Login",
		component: Login,
	},
	{
		path: "/home",
		name: "Home",
		// Lazy loading for better performance
		component: () => import("../views/Home.vue"),
	},
	{
		path: "/admin",
		name: "Admin",
		component: () => import("../views/AdminView.vue"),
		meta: { requiresAdmin: true },
	},
	{
		path: "/editor",
		name: "Editor",
		component: () => import("../views/EditorView.vue"),
		meta: { requiresEditor: true },
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const isAuthenticated = store.getters.isAuthenticated
	const isEnabled = store.getters.isEnabled

	if (!isAuthenticated && to.path !== "/") {
		next("/")
		return
	}

	if (isAuthenticated && !isEnabled && to.path !== "/") {
		store.dispatch("logout")
		next("/")
		return
	}

	if (isAuthenticated && to.path === "/") {
		next("/home")
		return
	}

	if (to.meta.requiresAdmin) {
		if (!store.getters.isAdmin) {
			next("/home")
			return
		}
	}

	if (to.meta.requiresEditor) {
		if (!store.getters.canAccessEditor) {
			next("/home")
			return
		}
	}

	next()
})

export default router
