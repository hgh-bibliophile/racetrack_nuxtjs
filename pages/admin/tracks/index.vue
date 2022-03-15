<template>
  <v-app>
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
        :items="tracks"
        :search="search"
      ></v-data-table>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: 'TracksIndexPage',
  data: () => ({
    search: '',
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: '# Lanes', value: 'lanes_ct' }
    ],
    tracks: []
  }),
  async fetch () {
    this.tracks = await this.$axios.$get('/tracks')
  }
}
</script>
