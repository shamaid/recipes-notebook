<template>
  <b-container>
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
          // if (this.saved != ""){
          //   return this.saved;
          //   }
          const response = await this.axios.get(
            this.$root.store.base_url + "/user/getAllSaved"
          );
          // console.log(response);
          // console.log(response.data);
          const allSavedRecipe = response.data;
          for (let i = 0; i < allSavedRecipe.length; i++) {
            // console.log(response.data[i].recipe_id);
            // console.log("this.recipe.id");
            // console.log(this.recipe.id);
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
          // console.log(this.recipe.id);
          // console.log(this.saved);
          //### add recipe to user favorite recipes
          if (!this.saved) {
            const response = await this.axios.put(
              this.$root.store.base_url + "/user/likeRecipe/" + this.recipe.id
            );
            this.saved = true;
            // console.log(response);
          } else {
            //### remove recipe from user favorite recipes
          }
        }
        // else {
        //   this.$root.toast(
        //     "Guest cannot add recipe to favorites",
        //     "You Need to login or register",
        //     "failed"
        //   );
        // }
      } catch (error) {
        console.log(error);
      }
    },
    async isWatched() {
      try {
        // console.log("isWatched");
        if (this.$root.store.username) {
          const response = await this.axios.get(
            this.$root.store.base_url + "/user/recipeInfo/" + this.recipe.id
          );
          // console.log(response);
          //  console.log("isWatched__response.data");
          // console.log(response.data);
          let recipe_info = response.data;
          // console.log("recipe_info");
          // console.log(recipe_info[this.recipe.id].watched);
          if (recipe_info[this.recipe.id].watched) {
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
  /* color: rgb(255, 255, 255);  */
  /* background-color: rgba(118, 133, 119, 0.4) ; */
  /* font-family: fantasy */

  /* padding-top: 100px; */
}
.recipe-title {
  /* padding-top: 50px; */
  padding-bottom: 20px;
  font-weight: bold;
  font-size: 24px;
  /* color: #000; */
  color: rgb(255, 255, 255);
}
.recipe-watched_saved {
  padding-top: 70px;
}
.card {
  margin: 20px;
  /* background: rgba(76, 175, 80, 0.3) */
  background: rgba(118, 133, 119, 0.4);
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
#postit1 {
  line-height: 1;
  text-align: center;
  width: 275px;
  margin: 25px;
  min-height: 250px;
  max-height: 250px;
  padding-top: 35px;
  position: relative;
  border: 1px solid #e8e8e8;
  border-top: 60px solid #fdfd86;
  font-family: "Reenie Beanie";
  font-size: 22px;
  border-bottom-right-radius: 60px 5px;
  display: inline-block;
  background: #ffff88; /* Old browsers */
  background: -moz-linear-gradient(
    -45deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    color-stop(81%, #ffff88),
    color-stop(82%, #ffff88),
    color-stop(82%, #ffff88),
    color-stop(100%, #ffffc6)
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    -45deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    -45deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(
    -45deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* IE10+ */
  background: linear-gradient(
    135deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  ); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffff88', endColorstr='#ffffc6',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
}
#postit1 .card-body::before {
  content: " ";
  display: block;
  position: absolute;
  left: 115px;
  top: -15px;
  width: 115px;
  height: 25px;
  z-index: 2;
  background-color: rgba(219, 223, 191, 0.5);
  border: 2px solid rgba(236, 234, 234, 0.5);
  -webkit-box-shadow: 0 0 5px #888;
  -moz-box-shadow: 0 0 5px #888;
  box-shadow: 2px 2px 2px #000;
  -webkit-transform: rotate(-6deg);
  -moz-transform: rotate(-6deg);
  -o-transform: rotate(-6deg);
}
#postit1:after {
  content: "";
  position: absolute;
  z-index: -1;
  right: -0px;
  bottom: 20px;
  width: 200px;
  height: 25px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 2px 15px 5px rgba(0, 0, 0, 0.4);
  -moz-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  -webkit-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  -o-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  -ms-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  transform: matrix(-1, -0.1, 0, 1, 0, 0);
}
</style>
