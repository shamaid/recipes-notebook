import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage"),
  },
  {
    path: "/aboutPage",
    name: "about",
    component: () => import("./pages/AboutPage"),
  },
  {
    path: "/myfavoriterecipes",
    name: "myfavoriterecipes",
    component: () => import("./components/FavoriteRecipePreviewList"),
  },
  {
    path: "/myrecipes",
    name: "myrecipes",
    component: () => import("./components/MyRecipePreviewList"),
  },
  {
    path: "/myfamilyrecipes",
    name: "myfamilyrecipes",
    component: () => import("./components/MyFamilyRecipePreviewList"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "*",
    name: "notFound",
    component: NotFound,
  },
];

export default routes;
