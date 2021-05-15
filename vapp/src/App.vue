<template>
<div>
  <div v-if="isDrizzleInitialized" id="app" data-color-mode="dark" data-dark-theme="dark_dimmed">
    <h4>Light</h4>
  </div>

  <div v-else>
    Check metamask
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'app',
  computed: mapGetters('drizzle', ['isDrizzleInitialized'])
}
</script>

<style>
</style>
