<template>
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
</template>

<script>
export default {
  name: 'TracksIndexPage',
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
