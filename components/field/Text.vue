<template>
  <v-col
    cols="12"
    sm="6"
    md="4"
  >
    <v-text-field
      v-model="val"
      :label="label"
      hide-details
      outlined
      dense
    ></v-text-field>
  </v-col>
</template>

<script>
export default {
  name: 'TextField',
  props: ['value', 'label'],
  data () {
    return {
      val: this.value
    }
  },
  watch: {
    val () {
      this.$emit('input', this.val)
    }
  }
}
</script>
