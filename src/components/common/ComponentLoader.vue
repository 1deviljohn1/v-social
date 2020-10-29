<template>
  <div class="component-loader center-align">
    <div class="preloader-wrapper active">
      <div class="spinner-layer spinner-blue-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentLoader'
}
</script>

<style lang="scss">
.component-loader {
  margin-top: 50px;
}
</style>
