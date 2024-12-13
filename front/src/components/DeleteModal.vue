<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96">
            <h2 class="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <div class="flex justify-end space-x-3">
                <button @click="onCancel" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Non
                </button>
                <button @click="onConfirm"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Oui
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    onCancel: {
        type: Function,
        required: true,
    },
    onConfirm: {
        type: Function,
        required: true,
    },

});

</script>