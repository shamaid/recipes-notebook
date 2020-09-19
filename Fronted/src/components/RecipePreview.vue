<template>
  <b-container >
    <div class="card" style="width:400px">
      <div class="card-body">
        <!-- title -->
        <div :title="recipe.title" class="recipe-title">
          <kbd>{{ recipe.title }} </kbd>
        </div>

        <!-- image -->
        <router-link
          :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
          class="recipe-preview"
        >
          <div class="recipe-body">
            <img
              :src="recipe.image"
              class="recipe-image"
              alt="Recipe's image"
            />
          </div>
        </router-link>

        <!-- text -->
        <div class="recipe-info">
          <b-button
            v-if="this.$root.store.username"
            size="sm"
            class="mb-2"
            variant="red"
          >
            <b-icon
              v-if="this.saved"
              icon="heart-fill"
              font-scale="1.7"
              variant="danger"
              aria-hidden="true"
            ></b-icon>
            <b-icon
              v-else
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
          <b-icon
            v-if="this.watched && this.$root.store.username"
            icon="eye"
            font-scale="1.7"
            aria-hidden="true"
            variant="dark"
          ></b-icon>
          <b-icon
            v-else-if="this.$root.store.username"
            icon="eye-slash"
            font-scale="1.7"
            aria-hidden="true"
            variant="dark"
          ></b-icon>
          <!-- </b-button> -->
          <!-- </div> -->

          <b-row>
            <b-col>
              <div class="recipe-footer">
                <ul class="recipe-overview">
                  <li id="kbd_light">{{ recipe.readyInMinutes }} minutes</li>
                  <li id="kbd_light">{{ recipe.aggregateLikes }} likes</li>
                </ul>
              </div>
            </b-col>

            <b-col>
              <div>
                <ul class="recipe-overview">
                  <li id="kbd_light" v-if="recipe.vegetarian">Vegetarian</li>
                  <li id="kbd_light" v-if="recipe.vegan">Vegan</li>
                  <li id="kbd_light" v-if="recipe.glutenFree">Gluten Free</li>
                </ul>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  mounted() {
    this.isSave();
    this.isWatched();
  },
  data() {
    return {
      watched: false,
      saved: false,
    };
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async isSave() {
      try {
        if (this.$root.store.username) {
          //### add recipe to user favorite recipes
         
          const response = await this.axios.get(
            this.$root.store.base_url + "/user/getAllSaved"
          );
          const allSavedRecipe = response.data;
          for (let i = 0; i < allSavedRecipe.length; i++) {
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
    },
    async saveRecipe() {
      try {
        if (this.$root.store.username) {
          
          //### add recipe to user favorite recipes
          if (!this.saved) {
            const response = await this.axios.put(
              this.$root.store.base_url + "/user/likeRecipe/" + this.recipe.id
            );
            this.saved = true;
          } 
        }
      } catch (error) {
        console.log(error);
      }
    },
    async isWatched() {
      try {
        if (this.$root.store.username) {
          const response = await this.axios.get(
            this.$root.store.base_url + "/user/recipeInfo/" + this.recipe.id
          );
          let recipe_info = response.data;

          if (recipe_info[this.recipe.id]!= undefined && recipe_info[this.recipe.id].watched) {
            this.watched = true;
            return true;
          } else {
            this.watched = false;
            return false;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.recipe-preview {
  display: inline-block;
  width: 90%;
  height: 100%;
  position: relative;
  margin: 10px 10px;
}
.recipe-preview > .recipe-body {
  width: 100%;
  height: 200px;
  position: relative;
}
.recipe-preview .recipe-body .recipe-image {
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  display: block;
  width: 98%;
  height: auto;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
}
.recipe-preview .recipe-footer {
  width: 100%;
  height: 50%;
  overflow: hidden;
}
.recipe-preview .recipe-footer .recipe-title {
  padding: 10px 10px;
  width: 100%;
  font-size: 12pt;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.recipe-preview .recipe-footer ul.recipe-overview {
  padding: 5px 10px;
  width: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -o-box-flex: 1;
  box-flex: 1;
  -webkit-flex: 1 auto;
  -ms-flex: 1 auto;
  flex: 1 auto;
  table-layout: fixed;
  margin-bottom: 0px;
}
.recipe-preview .recipe-footer ul.recipe-overview li {
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -o-box-flex: 1;
  -ms-box-flex: 1;
  box-flex: 1;
  -webkit-flex-grow: 1;
  flex-grow: 1;
  width: 90px;
  display: table-cell;
  text-align: center;
}
.recipe-info {
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  font-weight: bold;
  font-size: 18px;
  color: white;
 
}
.recipe-title {
  padding-bottom: 20px;
  font-weight: bold;
  font-size: 24px;
  color: rgb(255, 255, 255);
}
.recipe-watched_saved {
  padding-top: 70px;
}
.card {
  margin: 20px;
  background: rgba(211, 193, 209, 0.4);
  background: rgba(238, 238, 238, 1);
 
  
}
#kbd_light {
  background-color: #eee;
  border-radius: 3px;
  border: 1px solid #b4b4b4;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
    0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
  color: #333;
  display: inline-block;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}


</style>
