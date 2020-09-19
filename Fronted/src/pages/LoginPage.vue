<template>
  <div class="container">
    <h1 class="title">Login</h1>
    <b-form @submit.prevent="onLogin">
      <b-form-group
        id="input-group-Username"
        label-cols-sm="3"
        label="Username:"
        label-for="Username"
      >
        <b-form-input
          id="Username"
          v-model="$v.form.username.$model"
          type="text"
          :state="validateState('username')"
        ></b-form-input>
        <b-form-invalid-feedback>
          Username is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-Password"
        label-cols-sm="3"
        label="Password:"
        label-for="Password"
      >
        <b-form-input
          id="Password"
          type="password"
          v-model="$v.form.password.$model"
          :state="validateState('password')"
        ></b-form-input>
        <b-form-invalid-feedback>
          Password is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button
        type="submit"
        variant="primary"
        style="width:100px;display:block;"
        class="mx-auto w-100"
        >Login</b-button
      >
      <div class="mt-2">
        Do not have an account yet?
        <router-link to="register"> Register in here</router-link>
      </div>
    </b-form>
    <b-alert
      class="mt-2"
      v-if="form.submitError"
      variant="warning"
      dismissible
      show
    >
      Login failed: {{ form.submitError }}
    </b-alert>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        submitError: undefined,
      },
    };
  },
  validations: {
    form: {
      username: {
        required,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async Login() {
      try {
        const response = await this.axios.post(
          // "https://test-for-3-2.herokuapp.com/user/Login",
          this.$root.store.base_url + "/Login",
          {
            username: this.form.username,
            password: this.form.password,
          }
        );
   
        this.$root.store.login(this.form.username);
        //this.$root.store.username = this.form.username;
        this.$router.push("/").catch(() => {
          this.$forceUpdate();
        });

        //save profile picture

        if (!this.$root.store.profilePicture) {
          const PorfilePicture = await this.axios.get(
            this.$root.store.base_url + "/user/getUserPorfilePicture"
          );
          let link = PorfilePicture.data;
          let temp = JSON.stringify(PorfilePicture.data);
          this.$root.store.setProfilePicture(link);
          this.$root.store.profilePicture = link;
        }

        // window.location = 'pages/MainPage'
        // window.location = '/'
      } catch (err) {
        console.log(err.response);
        this.form.submitError = err.response.data.message;
      }
    },
    onLogin() {
      this.form.submitError = undefined;
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.Login();
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  max-width: 400px;
  padding-top: 20px;
  //background-color: rgba(202, 168, 218, 0.4);
  //background-color: rgba(220, 216, 240, 0.4);
   //border: 3px solid white;
  // border-radius: 35px;
  //  box-shadow: 10px 10px rgba(133, 132, 141, 0.4);
}
.mt-2{
   font-weight: bold;
    font-size: 16px;
   color: black;
  //  padding: 20px;
    padding-top: 20px;
      background-color: rgba(220, 216, 240, 0.4);
   //background-color: white;
  
}
@import url(https://fonts.googleapis.com/css?family=Caveat);

.title{
   margin-bottom: 20px;
    font-family: Caveat;
    font-size: 60px;
    font-weight: bold;
    
    
}
</style>
