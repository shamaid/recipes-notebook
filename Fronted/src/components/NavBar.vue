<template>
  <div class="navbarComponent">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-brand :to="{ name: 'main'}">Foodies</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'main' }">Main</b-nav-item>
          <b-nav-item :to="{ name: 'search' }">Search</b-nav-item>
          <b-nav-item :to="{ name: 'about' }">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-navbar-nav
            v-if="!$root.store.username && !this.$cookies.get('session')"
          >
            <b-nav-text >Hey Guest </b-nav-text>
            <b-nav-item :to="{ name: 'register' }">Register</b-nav-item>
            <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav v-else>
            <b-nav-text >Hey  {{ $root.store.username }} </b-nav-text>
            <b-nav-item-dropdown text=" Personal" right>
              <b-dropdown-item :to="{ name: 'myrecipes' }"
                >My Recpies</b-dropdown-item
              >
              <b-dropdown-item :to="{ name: 'myfamilyrecipes' }"
                >My Family Recpies</b-dropdown-item
              >
              <b-dropdown-item :to="{ name: 'myfavoriterecipes' }"
                >My Favorite Recpies</b-dropdown-item
              >
            </b-nav-item-dropdown>
            <b-nav-item @click="Logout" :to="{ name: 'main' }"
              >Logout</b-nav-item
            >
          </b-navbar-nav>
        </b-navbar-nav>
      </b-collapse>
      <div>
        <img
          v-if="this.$root.store.profilePicture"
          :src="this.$root.store.profilePicture"
          height="40"
          width="40"
          alt="Avatar"
          class="circular--square"
        />
      </div>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    Logout() {
      this.$root.store.logout();
      this.$root.toast("Logout", "User logged out successfully", "success");

      this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
    },
  },
};
</script>

<style lang="scss">
.navbarComponent{
  margin-bottom: 40px;
}

.circular--square {
  border-top-left-radius: 50% 50%;
  border-top-right-radius: 50% 50%;
  border-bottom-right-radius: 50% 50%;
  border-bottom-left-radius: 50% 50%;
}


</style>
