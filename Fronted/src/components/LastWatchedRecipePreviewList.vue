<template>
  <div>
    <RecipePreviewList
      v-if="recipes.length > 0"
      title="Last watched recipes"
      :recipes="recipes"
    />
    <RecipePreviewList
      v-if="noRecipes"
      title="You haven't seen any recipes yet"
      :recipes="recipes"
      class="container"
    />
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
      noRecipes: false,
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      try {
        const user_response = await this.axios.get(
          this.$root.store.base_url + "/user/lastviewed"
        );

        const user_recipes = user_response.data;

        let recipes_id = "";
        for (let index = 0; index < user_recipes.length; index++) {
          recipes_id += user_recipes[index].recipe_id;
          if (index + 1 < user_recipes.length) {
            recipes_id += ",";
          }
        }
        if(recipes_id !== ""){
        const response = await this.axios.get(
          this.$root.store.base_url + "/recipes/recipeInfo/" + recipes_id
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
        }
        if(this.recipes.length == 0){
            this.noRecipes =true;
        }
      } catch (error) {
        this.noRecipes =true;
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
