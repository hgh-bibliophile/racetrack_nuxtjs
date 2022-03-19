<template>
  <CRUDTable
    :title="title"
    :url="url"
    :tbl="tbl"
    :model="model" />
</template>

<script>
import CRUDTable from '~/components/CRUDTable.vue'
export default {
  name: 'TracksPage',
  components: { CRUDTable },
  data () {
    return {
      title: 'Tracks',
      url: '/tracks',
      model: {
        singular: 'Track',
        plural: this.title
      },
      tbl: {
        sort_by: 'id',
        headers: [
          { text: 'Id', align: 'start', value: 'id' },
          { text: 'Name', value: 'name' },
          { text: '# Lanes', value: 'lanes_ct' }
        ],
        default: {
          name: ''
        },
        editFields: [
          { label: 'Name', val: 'name' }
        ]
      }
    }
  }
}
</script>
