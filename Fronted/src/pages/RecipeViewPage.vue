<template>
  <div class="container">
    <div v-if="recipe">
      <div class="title">
        <h1>{{ recipe.title }}</h1>
        <img :src="recipe.image" class="center" />
      </div>
      <div class="recipe-body">
        <div class="wrapper">
          <div class="wrapped">
            <div class="mb-3">
              <div v-if="familyRecipe"> Recpie by: {{ recipe.recipeOwner }} </div>
              <div v-if="familyRecipe"> Recpie story: {{ recipe.recipeStory }} </div>
              <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
              <div>Likes: {{ recipe.aggregateLikes }} likes</div>
              <div>Servings: {{ recipe.servings }} servings</div>
              <div v-if="recipe.vegetarian">Vegetarian</div>
              <div v-if="recipe.vegan">Vegan</div>
              <div v-if="recipe.glutenFree">Gluten Free</div>
              <div>
                <b-button
                  v-if="this.$root.store.username"
                  size="sm"
                  class="mb-2"
                  variant="red"
                >
                  <b-icon v-if="this.saved"
                   
                    icon="heart-fill"
                    font-scale="1.7"
                    variant="danger"
                    aria-hidden="true"
                  ></b-icon>
                  <b-icon  v-else
                   
                    icon="heart"
                    font-scale="1.7"
                    v-on:click="saveRecipe()"
                    variant="danger"
                    aria-hidden="true"
                  ></b-icon>
                </b-button>
                <!-- <b-button
            v-if="this.$root.store.username"
            size="sm"
            class="mb-2"
            variant="red"
          > -->
                <b-icon v-if="this.watched && this.$root.store.username"
                 
                  icon="eye"
                  font-scale="1.7"
                  aria-hidden="true"
                  variant="dark"
                ></b-icon>
                <b-icon  v-else-if="this.$root.store.username"
                 
                  icon="eye-slash"
                  font-scale="1.7"
                  aria-hidden="true"
                  variant="dark"
                ></b-icon>
              </div>
            </div>
            Ingredients:
            <ul v-if="recipe.extendedIngredients">
              <li v-for="(r, index) in recipe.extendedIngredients" :key="index">
                {{ r.original }}
              </li>
            </ul>
            <ul v-else>
              <li
                v-for="(r, index) in recipe.ingredients"
                :key="index + '_' + r.name"
              >
                {{ r.name + " " + r.amount + " " + r.unit }}
              </li>
            </ul>
          </div>
          <div class="wrapped">
            Instructions:
            <ol>
              <li v-for="s in recipe._instructions" :key="s.number">
                {{ s.fstep.instruction }}
              </li>
            </ol>
          </div>
        </div>
      </div>
      <!-- <pre>
      {{ $route.params }}
      {{ recipe }}
    </pre
      > -->
    </div>
  </div>
</template>

<script>
export default {
  //  mounted() {
  //   this.isSave();
  // },
  data() {
    return {
      recipe: null,
      watched: true,
      saved: false,
      familyRecipe: false
    };
  },

  methods: {
    // async isSaved(){
    //   this.$root.$refs.RecipePreview.isSaved();
    // },

    async isSave() {
      if (
        this.$route.params.recipeId.charAt(0) != "u" &&
        this.$route.params.recipeId.charAt(0) != "f"
      ) {
        try {
          if (this.$root.store.username) {
            //### add recipe to user favorite recipes
            // if (this.saved != ""){
            //   return this.saved;
            //   }
            const response = await this.axios.get(
              this.$root.store.base_url + "/user/getAllSaved"
            );
            // console.log(response);
            console.log(response.data);
            const allSavedRecipe = response.data;
            for (let i = 0; i < allSavedRecipe.length; i++) {
              console.log(response.data[i].recipe_id);
              console.log("this.recipe.id");
              this.$route.params.recipeId;
              console.log(this.recipe);
              if (response.data[i].recipe_id == this.recipe.id) {
                this.saved = true;
                return true;
              }
            }
            this.saved = false;
            return false;
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    async saveRecipe() {
      console.log("saveRecipe");
      try {
        if (this.$root.store.username) {
          console.log(this.recipe.id);
          //### add recipe to user favorite recipes
          if (!this.saved) {
            await this.axios.put(
              this.$root.store.base_url + "/user/likeRecipe/" + this.recipe.id
            );
            this.saved = true;
          } else {
            //### remove recipe from user favorite recipes
          }
        } else {
          this.$root.toast(
            "Guest cannot add recipe to favorites",
            "You Need to login or register",
            "failed"
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    try {
      let response;
      let recipe_id;
      // response = this.$route.params.response;

      try {
        recipe_id = this.$route.params.recipeId;

        if (recipe_id.charAt(0) == "u") {
          response = await this.axios.get(
            this.$root.store.base_url + `/user/getUserRecipe/${recipe_id}`
          );
        } else if (recipe_id.charAt(0) == "f") {
          this.familyRecipe = true;
          response = await this.axios.get(
            this.$root.store.base_url + `/user/getUserFamilyRecipe/${recipe_id}`
          );
        } else {
          response = await this.axios.get(
            this.$root.store.base_url + `/recipes/showRecipe/${recipe_id}`
          );
          console.log(this.$root.store.base_url + `/recipes/showRecipe/${recipe_id}`);
          if (this.$root.store.username) {
            await this.axios.get(
              this.$root.store.base_url + `/user/viewRecipe/${recipe_id}`
            );
          }
        }

        // console.log("response.status", response.status);
        if (response.status !== 200) this.$router.replace("/NotFound");
      } catch (error) {
        console.log("error.response.status", error.response.status);
        this.$router.replace("/NotFound");
        return;
      }


      let {
        //analyzedInstructions,
        instructions,
        extendedIngredients,
        ingredients,
        aggregateLikes,
        readyInMinutes,
        image,
        vegetarian,
        vegan,
        glutenFree,
        servings,
        title,
        id,
         recipeOwner,
        recipeStory,
      } = response.data[recipe_id];

    
      let _instructions = instructions.map((fstep) => {
        return {
          fstep,
        };
      });

      let _recipe = {
        //instructions,
        _instructions,
        //analyzedInstructions,
        extendedIngredients,
        ingredients,
        aggregateLikes,
        readyInMinutes,
        image,
        vegetarian,
        vegan,
        glutenFree,
        servings,
        title,
        id,
        recipeOwner,
        recipeStory,
      };

  
      this.recipe = _recipe;
    } catch (error) {
      console.log(error);
    }
    this.isSave();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}
.wrapped {
  width: 50%;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  width: 50%;
  border: 5px solid white;
  
}
@import url(https://fonts.googleapis.com/css?family=Pacifico);
.title{
   margin-bottom: 20px;
    font-family: Pacifico;
    font-size: 80px;
    font-weight: bold;
    text-shadow: 2px 2px 4px white;
    
}

@import url(https://fonts.googleapis.com/css?family=Oswald);

.recipe-body{
  background-color: rgba(202, 168, 218, 0.4);
  background-color: rgba(220, 216, 240, 0.8);
  background: rgba(238, 238, 238, 0.8);

  border: 3px solid white;
  border-radius: 35px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 20px;
  //font-family: Oswald;

}
/* .recipe-header{

} */
</style>
