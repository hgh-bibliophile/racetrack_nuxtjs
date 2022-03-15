<template>
  <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <div class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
        <h1 class="text-2xl leading-7 font-semibold">
          Hello {{ $route.params.watch }}!
        </h1>
          <v-card>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="lanes"
              :search="search"
            ></v-data-table>
          </v-card>

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
