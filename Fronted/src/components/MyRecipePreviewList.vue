<template>
  <div>
    <div>
      <RecipePreviewList
        v-if="recipes.length > 0"
        title="My recipes"
        :recipes="recipes"
        class="container"
      />
      <RecipePreviewList
        v-if="noRecipes"
        title="No recipes yet"
        :recipes="recipes"
        class="container"
      />
    </div>
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
          this.$root.store.base_url + "/user/getUserAllRecipes"
        );

        const user_recipes = user_response.data;
        
        let _recipes = Object.entries(user_recipes);
        _recipes.forEach((el) => (el[1].id = el[0]));
        let _allRecipes = [];
        let i;
        for (i = 0; i < _recipes.length; i++) {
          _allRecipes.push(_recipes[i][1]);
        }

        const recipes = _allRecipes;
        
        this.recipes = [];
        this.recipes.push(...recipes);
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

<style lang="scss" scoped>
.container {
  position: sticky;
  align-items: center;
  left-margin: 50%;
  width: 50%;
  alignment: center;
  padding-top: 3%;
  padding-bottom: 3%;
  margin-top: 2%;
}</style>
