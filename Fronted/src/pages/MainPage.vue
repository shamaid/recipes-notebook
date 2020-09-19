<template>
  <b-container class="container">
    <b-row>
      <b-col>
        <h2 class="title text-center">Welcome to Doron and Oscar Food World</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <RandomRecipePreviewList
          :class="{
            RandomRecipes: true,
            center: true,
          }"
          disabled
        ></RandomRecipePreviewList>
      </b-col>
      <b-col v-if="!$root.store.username">
        <login-page></login-page>
      </b-col>

      <b-col v-else>
        <LastWatchedRecipePreviewList
          :class="{
            RandomRecipes: true,
            blur: !$root.store.username,
            center: true,
          }"
          disabled
        ></LastWatchedRecipePreviewList>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RandomRecipePreviewList from "../components/RandomRecipePreviewList";
import LastWatchedRecipePreviewList from "../components/LastWatchedRecipePreviewList";
//import RecipePreviewList from "../components/RecipePreviewList";
import LoginPage from "../pages/LoginPage";
export default {
  components: {
    RandomRecipePreviewList,
    LastWatchedRecipePreviewList,
    LoginPage,
  },
  data() {
    return {
      image: "",
      component: RandomRecipePreviewList,
    };
  },
  methods: {
    //  previewImage: function(event) {
    //         // Reference to the DOM input element
    //         var input = event.target;
    //         // Ensure that you have a file before attempting to read it
    //         if (input.files && input.files[0]) {
    //             // create a new FileReader to read this image and convert to base64 format
    //             var reader = new FileReader();
    //             // Define a callback function to run, when FileReader finishes its job
    //             reader.onload = (e) => {
    //                 // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
    //                 // Read image as base64 and set to imageData
    //                 this.image = e.target.result;
    //             }
    //             // Start the reader job - read file as a data url (base64 format)
    //             reader.readAsDataURL(input.files[0]);
    //         }
    //     },
    //  checkUser(){
    //    //console.log($root.store.username);
    //    console.log(this.$root.store.username);
    //    return true;
    //  }
  },
};
</script>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Pacifico);

.title{
   margin-bottom: 40px;
    font-family: Pacifico;
    font-size: 40px;
    text-shadow: 2px 2px 4px white;
}
.RandomRecipes {
  margin: 10px 0 10px;
}
.blur {
  -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  filter: blur(2px);
}
::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}

</style>
