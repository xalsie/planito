<template>
	<main class="flex-grow bg-gray-100 py-20">
		<div class="container mx-auto px-6">
			<div class="bg-white rounded-xl shadow-2xl max-w-md mx-auto p-10 border border-gray-100">
				<div class="mb-8 text-center">
					<h1 class="text-3xl font-bold text-blue-600 mb-3 primary-heading">Connexion</h1>
					<p class="text-sm text-gray-600 font-poppins">Connectez-vous à votre compte</p>
				</div>

<<<<<<< HEAD
				<form @submit.prevent="login" class="space-y-6">
=======
				<form @submit.prevent="handleSubmit" class="space-y-6">
>>>>>>> beta
					<div class="space-y-4">
						<div>
							<label for="email" class="block mb-2 text-sm font-medium text-gray-700 font-poppins">
								Adresse email
							</label>
							<input type="email" name="email" id="email" v-model="email" placeholder="exemple@email.com"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
								required>
						</div>

						<div>
							<div class="flex justify-between mb-2">
								<label for="password" class="text-sm font-medium text-gray-700 font-poppins">
									Mot de passe
								</label>
								<a href="#" class="text-sm text-blue-600 hover:text-blue-800 font-poppins">
									Mot de passe oublié ?
								</a>
							</div>
							<input type="password" name="password" id="password" v-model="password"
								placeholder="••••••••"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
								required>
						</div>
					</div>

					<div class="space-y-6">
						<button type="submit"
							class="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors font-poppins">
							SE CONNECTER
						</button>

						<p class="text-center text-sm text-gray-600 font-poppins">
							Pas encore de compte ?
<<<<<<< HEAD
							<router-link to="/inscription"
=======
							<router-link to="/register"
>>>>>>> beta
								class="text-blue-600 hover:text-blue-800 font-bold font-poppins">
								S'inscrire
							</router-link>
						</p>
					</div>
				</form>
			</div>
		</div>
	</main>
</template>

<script setup>
<<<<<<< HEAD
import { ref } from 'vue'
import { useUserStore } from "../stores/user-store"; // Assurez-vous du bon chemin vers le store


const email = ref('')
const password = ref('')

const userStore = useUserStore();


const login = async () => {
	try {
		await userStore.login(email.value, password.value);
		console.log(userStore.schoolId);
		if (userStore.schoolId) localStorage.setItem("schoolId", userStore.schoolId)
		localStorage.setItem("isLoggedIn", userStore.isLoggedIn)



	} catch (error) {
		console.error("Login failed:", error);
	}
}




</script>
=======
	import { ref } from 'vue'
	import { useRouter } from 'vue-router'

	const email = ref('')
	const password = ref('')

	const router = useRouter()

	const handleSubmit = async () => {
		const response = await fetch('http://localhost:3000/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email.value,
				password: password.value
			})
		});

		try {
			const {
				token,
				user
			} = await response.json();

			console.log(token, user)

			localStorage.setItem('token', token)
			localStorage.setItem('user', JSON.stringify(user))

			if (user.roles.includes('ROLE_INTERVENANT')) {
				router.push({
					name: 'intervenant-calendrier'
				})
			} else if (user.roles.includes('ROLE_SCHOOL')) {
				router.push({
					name: 'dashboard-ecole'
				})
			}
		} catch (error) {
			console.log("An error occurred");
			return error;
		}
	}
</script>
>>>>>>> beta
