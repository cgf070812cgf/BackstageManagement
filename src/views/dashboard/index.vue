<template>
  <div>
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: { Card, Sale, Observe },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
