<template>
	<main class="flex-grow bg-gray-100 py-20">
		<div class="container mx-auto px-6">
			<div class="bg-white rounded-xl shadow-2xl max-w-md mx-auto p-10 border border-gray-100">
				<div class="mb-8 text-center">
					<h1 class="text-3xl font-bold text-blue-600 mb-3 primary-heading">Inscription</h1>
					<p class="text-sm text-gray-600 font-poppins">Créez votre compte Planito</p>
				</div>

				<form class="space-y-6">
					<div class="space-y-4">
						<div>
							<label for="name" class="block mb-2 text-sm font-medium text-gray-700 font-poppins">
								Nom complet
							</label>
							<input 
								type="text" 
								name="name" 
								id="name" 
								placeholder="Nom complet" 
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
								required
							>
						</div>

						<div>
							<label for="email" class="block mb-2 text-sm font-medium text-gray-700 font-poppins">
								Adresse email
							</label>
							<input 
								type="email" 
								name="email" 
								id="email" 
								placeholder="exemple@email.com" 
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
								required
							>
						</div>

						<div>
							<label for="password" class="block mb-2 text-sm font-medium text-gray-700 font-poppins">
								Mot de passe
							</label>
							<input 
								type="password" 
								name="password" 
								id="password" 
								placeholder="••••••••" 
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
								required
							>
						</div>

						<div>
							<label for="confirm_password" class="block mb-2 text-sm font-medium text-gray-700 font-poppins">
								Confirmer le mot de passe
							</label>
							<input 
								type="password" 
								name="confirm_password" 
								id="confirm_password" 
								placeholder="••••••••" 
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
								required
							>
						</div>
					</div>

					<div class="space-y-6">
						<div class="flex items-center">
							<input 
								type="checkbox" 
								id="terms" 
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							>
							<label for="terms" class="ml-2 block text-sm text-gray-700 font-poppins">
								J'accepte les <a href="#" class="text-blue-600 hover:text-blue-800">conditions d'utilisation</a>
							</label>
						</div>

						<button 
							type="submit" 
							class="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors font-poppins"
						>
							CRÉER MON COMPTE
						</button>

						<p class="text-center text-sm text-gray-600 font-poppins">
							Déjà inscrit ?
							<router-link to="/connexion" class="text-blue-600 hover:text-blue-800 font-bold font-poppins">
								Se connecter
							</router-link>
						</p>
					</div>
				</form>
			</div>
		</div>
	</main>
</template>

<script setup>
</script> 