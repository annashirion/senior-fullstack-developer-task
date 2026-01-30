import { createStore } from "vuex"
import axios from "axios"
import { UserRole } from "../enums/user-roles.enum"
import { UserStatus } from "../enums/user-status.enum"

export default createStore({
	state: {
		user: null,
	},
	getters: {
		username: (state) => state.user?.username || "",
		roles: (state) => state.user?.roles || [],
		status: (state) => state.user?.status || "",
		isAuthenticated: (state) => !!state.user,
		isEnabled: (state) => {
			return state.user?.status === UserStatus.Enabled
		},
		hasRole: (state) => (role) => {
			return state.user?.roles?.includes(role) || false
		},
		isAdmin: (state) => {
			return state.user?.roles?.includes(UserRole.Admin) || false
		},
		isEditor: (state) => {
			return state.user?.roles?.includes(UserRole.Editor) || false
		},
		canAccessEditor: (state) => {
			const roles = state.user?.roles || []
			return roles.includes(UserRole.Editor) || roles.includes(UserRole.Admin)
		},
	},
	mutations: {
		SET_USER(state, user) {
			state.user = user
		},
		CLEAR_USER(state) {
			state.user = null
		},
	},
	actions: {
		async login({ commit }, username) {
			try {
				const response = await axios.post(`/api/users/login/${username}`)
				if (response.data.status === UserStatus.Disabled) {
					return {
						success: false,
						message: "User disabled",
					}
				}
				if (response.data.status === UserStatus.Deleted) {
					return {
						success: false,
						message: "User deleted",
					}
				}
				commit("SET_USER", response.data)
				return { success: true, user: response.data }
			} catch (error) {
				return {
					success: false,
					message: error.response?.data?.message,
				}
			}
		},
		logout({ commit }) {
			commit("CLEAR_USER")
		},
	},
	modules: {},
})
