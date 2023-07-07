<template>
  <div>
        <Navigation/>
        <transition name="slide" mode="out-in">
            <router-view></router-view>
        </transition>
  </div>
</template>

<script>
import Navigation from '../components/Navigation'

export default {
  name: 'App',
  components:{
    Navigation
  },
  data: () => ({
    //
  }),
};
</script>

<style>
.slide-enter-active {
  transition: all .3s ease;
}
.slide-leave-active {
  transition: all .3s ease;
}
.slide-enter, .slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

</style>