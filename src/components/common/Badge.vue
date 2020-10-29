<template>
  <div class="badge-wrapper">
    <img v-if="photoUrl" :style="style" :src="photoUrl" class="badge" />
    <strong v-else :style="style" :class="{ invert: invertColor }" class="badge">
      {{ alias && alias.substr(0, 2) }}
    </strong>
    <i v-if="followIcon" class="material-icons follow-icon white-text">people</i>
    <i v-if="firstUserIcon" class="material-icons first-user-icon white-text">star</i>
  </div>
</template>

<script>
export default {
  name: 'Badge',
  props: ['photoUrl', 'alias', 'invertColor', 'size', 'followIcon', 'firstUserIcon'],
  computed: {
    style() {
      return `width: ${this.size}px; height: ${this.size}px`
    }
  }
}
</script>

<style lang="scss">
.badge-wrapper {
  display: inline-block;
  position: relative;
  overflow: hidden;

  .follow-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 15px;
    background: $main_color_lighten;
    padding: 6px;
    border-radius: 100%;
  }

  .first-user-icon {
    position: absolute;
    top: 0;
    right: 0%;
    font-size: 15px;
    background: $main_color_lighten;
    padding: 6px;
    border-radius: 100%;
  }

  .badge {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    background: $white_color;
    border-radius: 100%;
    color: $main_color;
    text-transform: uppercase;

    &.invert {
      background: $main_color;
      color: $white_color;
    }
  }
}
</style>
