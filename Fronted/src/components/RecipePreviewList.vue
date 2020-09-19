<template>
  <b-container >
    <h3 class="title">
      {{ title }}
      <slot></slot>
    </h3>
    <b-row v-for="r in recipes" :key="r.id" >
      <b-col >
        <RecipePreview class="recipePreview" :recipe="r" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    recipes: {
      type: Array,
      required: true,
    },
  },

};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
.recipePreview{
  
}
h3 {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: Caveat;
  font-size: 40px;
  // font-weight: bold;
  // text-shadow: 2px 2px 4px white;
}
</style>
