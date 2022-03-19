<template>
  <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <div class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
        <h1 class="text-2xl leading-7 font-semibold">
          Hello {{ $route.params.watch }}!
        </h1>
        <div v-for="i in 4" :key="i" class="p-6 max-w-2xl bg-white text-center rounded-lg border-8 border-green-500 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <h1 class="mb-2 text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            2 - Abby Hartfelder
          </h1>
          <h2 class="mb-3 text-6xl font-normal text-gray-700 dark:text-gray-400">
            235.1 mph
          </h2>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RaceWatchPage',
  data: () => ({
    search: '',
    headers: [
      { text: '#', align: 'start', value: 'lane_number' },
      { text: 'Color', value: 'color' },
      { text: 'Dist', value: 'distance' }
    ],
    lanes: []
  }),
  async fetch () {
    this.lanes = await this.$axios.$get('/lanes')
  }
}
</script>
