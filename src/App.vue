<template lang="pug">
  v-app
    v-app-bar.indigo(app dark)
      v-icon.cyan--text(large) mdi-chevron-double-down
      .d-flex.title.px-4 Vent Vert
      v-spacer
    v-content
      helloWorld

</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({

  })
}
</script>
