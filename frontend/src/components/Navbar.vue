<template>
	<nav class="navbar">
		<router-link to="/home" class="hover:text-gray-300">Home</router-link>
		<router-link to="/admin" class="hover:text-gray-300">Admin</router-link>
		<router-link to="/editor" class="hover:text-gray-300">Editor</router-link>
	</nav>
</template>

<style scoped>
.navbar {
	display: flex;
	justify-content: space-between;
	width: 250px;
	margin: 0 auto;
}
</style>
