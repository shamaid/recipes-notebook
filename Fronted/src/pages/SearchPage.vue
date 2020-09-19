<template>
  <div>
    <div class="container">
      <h1 class="title">Search Recipes</h1>
      <b-form-input
        placeholder="Enter your search"
        class="is-field is-searchPage"
        type="text"
        ref="input"
        v-model="search_query"
        size="45"
      />
      <input
        class="searchBtn"
        type="button"
        :value="this.text"
        v-on:click="searchRecipes"
      />
      <div class="numOptions">
        <b-form-select
          v-model="num"
          :options="numOptions"
          size="md"
          class="mt-3"
        ></b-form-select>
      </div>
      <SearchFilter
        class="SearchFiltering"
        v-on:childToParent="onFilter"
      ></SearchFilter>
      <br />
      <BFormRadioGroup
        id="sort_radio"
        v-model="sort_by"
        :options="sort_by_values"
        @change="sortChanged"
        name="sort_radio"
      ></BFormRadioGroup>
    </div>

    <RecipePreviewList
      v-if="searched"
      title="Recipes Found"
      :recipes="recipes"
    />
    <br />
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList.vue";
import SearchFilter from "../components/SearchFilter.vue";
import { BFormRadioGroup } from "bootstrap-vue";
export default {
  name: "SearchPage",
  components: {
    RecipePreviewList,
    SearchFilter,
    BFormRadioGroup,
  },
  data() {
    return {
      search_query: "",
      recipes: [],
      num: "5",
      numOptions: [
        { value: "5", text: "Number of recpies" },
        { value: "5", text: "5" },
        { value: "10", text: "10" },
        { value: "15", text: "15" },
      ],
      filterCuisine: [],
      filterDiet: [],
      filterIntolerance: [],
      searched: false,
      filterText: "",
      sort_by_values: [
        { text: "Prep Time", value: "time" },
        { text: "Popularity", value: "popularity" },
      ],
      sort_by: "time",
    };
  },
  created() {
    //  this.cuisineOptions = this.options;
  },
  mounted() {
    if (
      localStorage.getItem("search" + this.$root.store.username) &&
      localStorage.getItem("searchRecipes" + this.$root.store.username)
    ) {
      this.search_query = localStorage.getItem(
        "search" + this.$root.store.username
      );

      this.recipes = JSON.parse(
        localStorage.getItem("searchRecipes" + this.$root.store.username)
      );
      this.searched = true;
      console.log(this.search_query);
      console.log(this.search_query);
      console.log(this.recipes);
    }
  },
  props: {
    text: {
      type: String,
      default: "Search",
    },
  },
  methods: {
    clickOn: function() {
      // Execute request
      this.fetch();
    },

    sortChanged() {
      let results = this.recipes.slice();
      if (this.searched === true) {
        if (this.sort_by === "popularity")
          results.sort(function(res1, res2) {
            return res1["readyInMinutes"] - res2["readyInMinutes"];
          });
        else
          results.sort(function(res1, res2) {
            return res2["aggregateLikes"] - res1["aggregateLikes"];
          });

        this.recipes = results;
      }
    },

    async searchRecipes() {
      this.recipes = [];
      let filters = this.getFilters();
      // if (this.search_query.length == 0) {
      //   this.search_query = " ";
      // }
      try {
        const response = await this.axios.get(
          "http://localhost:3000/recipes/search/query/" +
            this.search_query +
            "/amount/" +
            this.num +
            "?" +
            filters
        );
        // console.log(
        //   "http://localhost:3000/recipes/search/query/" +
        //     this.search_query +
        //     "/amount/" +
        //     this.num +
        //     "?" +
        //     filters
        // );

        let _recipes = Object.entries(response.data);
        _recipes.forEach((el) => (el[1].id = el[0]));
        let _allRecipes = [];
        let i;
        for (i = 0; i < _recipes.length; i++) {
          _allRecipes.push(_recipes[i][1]);
        }
        if (_allRecipes.length > 0) {
          this.recipes.push(..._allRecipes);
        } else {
          this.$root.toast(
            "Search Results",
            "Didnt find any results for your search",
            "failed"
          );
        }
        this.searched = true;
        let results = this.recipes.slice();
        if (this.sort_by === "time")
          results.sort(function(res1, res2) {
            return res1["readyInMinutes"] - res2["readyInMinutes"];
          });
        else
          results.sort(function(res1, res2) {
            return res2["aggregateLikes"] - res1["aggregateLikes"];
          });

        this.recipes = results;
        this.saveSearch();
      } catch (error) {
        console.log(error);
      }
    },
    saveSearch() {
      if (this.$root.store.username) {
        // this.$root.store.userLastSearch = this.search_query;
        // this.$root.store.lastReuslts = this.recipes;
        if (
          localStorage.getItem("search" + this.$root.store.username) &&
          localStorage.getItem("searchRecipes" + this.$root.store.username)
        ) {
          localStorage.removeItem("search" + this.$root.store.username);
          localStorage.removeItem("searchRecipes" + this.$root.store.username);
        }
        this.$root.store.setSearch(this.search_query);
        this.$root.store.setRecipes(this.recipes);
      }
    },
    getFilters() {
      this.filterText = "";
      this.fileFormator(this.filterCuisine, "cuisine");
      this.fileFormator(this.filterDiet, "diet");
      this.fileFormator(this.filterIntolerance, "intolerance");
      return this.filterText;
    },
    fileFormator(filterArray, filterName) {
      for (let i = 0; i < filterArray.length; i++) {
        filterArray[i].name = filterArray[i].name.split(" ").join("+");
        if (i == 0) {
          this.filterText = this.filterText + "&";
          this.filterText =
            this.filterText + filterName + "=" + filterArray[i].name;
        }
        if (i > 0) {
          this.filterText = this.filterText + "," + filterArray[i].name;
        }
      }
    },
    onFilter(value) {
      if (value.name === "cuisine") {
        this.filterCuisine = value.value;
      } else if (value.name === "diet") {
        this.filterDiet = value.value;
      } else {
        this.filterIntolerance = value.value;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  align-items: center;
  left-margin: 50%;
  background: "grey";
  //opacity: 80%;
  width: 50%;
  alignment: center;
  padding-top: 3%;
  padding-bottom: 3%;
  margin-top: 2%;
}
.numOptions {
  align-items: center;
  width: 400px;
  left-margin: 30%;
}

.searchBtn {
  background-color: rgb(0, 0, 0);
  border: none;
  color: rgb(255, 255, 255);

  padding: 8px 22px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 8px 2px;
  cursor: pointer;
}

@import url(https://fonts.googleapis.com/css?family=Caveat);

.title {
  margin-bottom: 20px;
  font-family: Caveat;
  font-size: 60px;
  font-weight: bold;
}
// .title{
//   text-align: left;
// }
</style>
