<template>
  <div>
    <RecipePreviewList
    title="Explore these recipes" 
    :recipes="recipes" 
    class="RecipePreviewList"
    >
    </RecipePreviewList> 
    <b-button
      type="submit"
      variant="primary"
      style="width:100px;display:block;"
      class="mx-auto"
      v-on:click="more_recipes"
      >More Recipes
    </b-button>
  </div>
</template>

<script>
import RecipePreviewList from "./RecipePreviewList";
export default {
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      recipes: [],
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      try {
        const response = await this.axios.get(
          this.$root.store.base_url + "/recipes/random"
        );

        let _recipes = Object.entries(response.data);
        _recipes.forEach((el) => (el[1].id = el[0]));
        let _allRecipes = [];
        let i;
        for (i = 0; i < _recipes.length; i++) {
          _allRecipes.push(_recipes[i][1]);
        }

        const recipes = _allRecipes;
        this.recipes = [];
        this.recipes.push(...recipes);
      } catch (error) {
        console.log(error);
      }
    },
    more_recipes() {
      this.updateRecipes();
    },
  },
};
</script>

<style lang="scss" scoped>

// @import url(https://fonts.googleapis.com/css?family=Pacifico);

// .RecipePreviewList{
//    margin-bottom: 40px;
//     font-family: Pacifico;
//     font-size: 40px;
//     font-weight: bold;
    
// }


</style>
