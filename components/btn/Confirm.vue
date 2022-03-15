<template>
  <v-btn
    class="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    color="white"
    text
    @click="$emit('click-event')"
  >
    <slot>
      Confirm <!-- fallback content -->
    </slot>
  </v-btn>
</template>

<script>
export default {
  name: 'ConfirmBtn'
}
</script>
