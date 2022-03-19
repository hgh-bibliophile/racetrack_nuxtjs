<template>
  <CRUDTable
    :title="title"
    :url="url"
    :tbl="tbl"
    :model="model"
  />
</template>

<script>
import CRUDTable from '~/components/CRUDTable.vue'
export default {
  name: 'TPage',
  components: { CRUDTable },
  data () {
    return {
      title: 'Lanes',
      url: '/lanes',
      model: {
        singular: 'Lane',
        plural: this.title
      },
      tbl: {
        sort_by: 'lane_number',
        headers: [
          { text: '#', align: 'start', value: 'lane_number' },
          { text: 'Color', value: 'color' },
          { text: 'Dist', value: 'distance' }
        ],
        exclude: {
          onUpdate: ['track']
        },
        default: {
          lane_number: null,
          color: '',
          distance: 24
        },
        editFields: [
          { label: 'Lane #', val: 'lane_number' },
          { label: 'Color', val: 'color' },
          { label: 'Distance', val: 'distance' }
        ]
      }
    }
  }
}
</script>
