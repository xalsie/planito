// stores/userStore.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: false,
    schoolId: "",
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const userData = await response.json();
        this.isLoggedIn = true;
        this.schoolId = userData.schoolId;

        if (!response.ok) {
          throw new Error("Something went wrong, request failed!");
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
});
