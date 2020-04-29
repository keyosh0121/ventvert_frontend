<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark)
      .d-flex.align-center ventveit
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
