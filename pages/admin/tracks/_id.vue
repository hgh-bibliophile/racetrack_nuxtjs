<template>
  <CRUDTable
    :title="title"
    :url="url"
    :tbl="tbl"
    :model="model"
    post-array
  />
</template>

<script>
import CRUDTable from '~/components/CRUDTable.vue'
export default {
  name: 'TPage',
  components: { CRUDTable },
  data () {
    return {
      title: 'Track (' + this.$route.params.id + ') - Lanes',
      url: '/tracks/' + this.$route.params.id + '/lanes',
      model: {
        singular: 'Lane',
        plural: 'Lanes'
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
