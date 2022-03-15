<template>
  <v-btn
    class="bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
    color="grey darken-3"
    text
    outlined
    plain
    @click="$emit('click-event')"
  >
    <slot>
      Cancel <!-- fallback content -->
    </slot>
  </v-btn>
</template>

<script>
export default {
  name: 'CancelBtn'
}
</script>
