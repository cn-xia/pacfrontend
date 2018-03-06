<template>
  <div id="app">
    <div id="header">
    </div>
    <TopStepBar></TopStepBar>
      
    
    <router-view/>
    
  </div>
</template>

<script>
import TopStepBar from "./components/TopStepBar.vue"
export default {
  name: 'App',
  components:{TopStepBar},
}
</script>

<style lang="scss">
  @import './style/_scroll-bar.scss';
  @import './style/element-variables.scss';
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
} */
</style>
