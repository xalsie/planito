//@ts-nocheck
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const intervenants = ref(null);

  const getIntervenantsFromSchool = async (schoolId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${schoolId}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong, request failed!");
      }

      if (response.status === 404) {
        throw new Error("Could not fin intervenants");
      }
      intervenants.value = await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  return {
    product,
    actualLanguage,
    updateLanguage,
    getProduct,
  };
});
