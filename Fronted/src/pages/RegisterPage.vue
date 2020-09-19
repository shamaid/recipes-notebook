<template>
  <div class="container">
    <h1 class="title">Register</h1>
    <b-form @submit.prevent="onRegister" @reset.prevent="onReset">

      <b-form-group
        id="input-group-username"
        label-cols-sm="3"
        label="Username:"
        label-for="username"
      >
        <b-form-input
          id="username"
          v-model="$v.form.username.$model"
          type="text"
          :state="validateState('username')"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.username.required">
          Username is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.username.length">
          Username length should be between 3-8 characters long
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.username.alpha">
          Username must contain only letters
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-firstName"
        label-cols-sm="3"
        label="First Name:"
        label-for="firstName"
      >
        <b-form-input
          id="firstName"
          v-model="$v.form.firstName.$model"
          type="text"
          :state="validateState('firstName')"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.firstName.required">
          first Name is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.firstName.length">
          first Name length should be bigger than 1 characters long
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.firstName.alpha">
          first Name alpha
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-lastName"
        label-cols-sm="3"
        label="Last Name:"
        label-for="lastName"
      >
        <b-form-input
          id="lastName"
          v-model="$v.form.lastName.$model"
          type="text"
          :state="validateState('lastName')"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.lastName.required">
          last Name is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.lastName.length">
          last Name length should be bigger than 1 characters long
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.lastName.alpha">
          last Name alpha
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-email"
        label-cols-sm="3"
        label="Email:"
        label-for="email"
      >
        <b-form-input
          id="email"
          type="email"
          v-model="$v.form.email.$model"
          :state="validateState('email')"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.email.required">
          Email address is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.email.email">
          Email is not a properly formatted email address
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-image"
        label-cols-sm="3"
        label="Profile Picture:"
        label-for="image"
      >
       
        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          @change="previewImage"
          accept="image/*"
        ></b-form-file>
      </b-form-group>

    

      <b-form-group
        id="input-group-country"
        label-cols-sm="3"
        label="Country:"
        label-for="country"
      >
        <b-form-select
          id="country"
          v-model="$v.form.country.$model"
          :options="countries"
          :state="validateState('country')"
        ></b-form-select>
        <b-form-invalid-feedback>
          Country is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-Password"
        label-cols-sm="3"
        label="Password:"
        label-for="password"
      >
        <b-form-input
          id="password"
          type="password"
          v-model="$v.form.password.$model"
          :state="validateState('password')"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.password.required">
          Password is required
        </b-form-invalid-feedback>
        <b-form-text v-else-if="$v.form.password.$error" text-variant="info">
          Your password should be <strong>strong</strong>. <br />
          For that, your password should be also:
        </b-form-text>
        <b-form-invalid-feedback
          v-if="$v.form.password.required && !$v.form.password.length"
        >
          Have length between 5-10 characters long
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.password.containsSpecial">
          Contain at least one special character
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.password.containsNumber">
          Contain at least one number
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-confirmedPassword"
        label-cols-sm="3"
        label="Confirm Password:"
        label-for="confirmedPassword"
      >
        <b-form-input
          id="confirmedPassword"
          type="password"
          v-model="$v.form.confirmedPassword.$model"
          :state="validateState('confirmedPassword')"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.confirmedPassword.required">
          Password confirmation is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else-if="!$v.form.confirmedPassword.sameAsPassword"
        >
          The confirmed password is not equal to the original password
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="reset" variant="danger">Reset</b-button>
      <b-button
        type="submit"
        variant="primary"
        style="width:250px;"
        class="ml-5 w-75"
        >Register</b-button
      >
      <div class="mt-2">
        You have an account already?
        <router-link to="login" > Log in here</router-link>
      </div>
    </b-form>
    <b-alert
      class="mt-2"
      v-if="form.submitError"
      variant="warning"
      dismissible
      show
    >
      Register failed: {{ form.submitError }}
    </b-alert>
   
  </div>
</template>

<script>
import countries from "../assets/countries";
import {
  required,
  minLength,
  maxLength,
  alpha,
  sameAs,
  email,
  url,
  regex,
  helpers,
} from "vuelidate/lib/validators";

const containsNumber = helpers.regex("containsNumber ", /[0-9]/);
const containsSpecial = helpers.regex("containsSpecial ", /[#?!@$%^&*-]/);

export default {
  name: "Register",
  data() {
    return {
      form: {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        password: "",
        confirmedPassword: "",
        email: "",
        image: "",
        submitError: undefined,
      },
      file: null,
      imageData: "",
      countries: [{ value: null, text: "", disabled: true }],
      errors: [],
      validated: false,
    };
  },
  validations: {
    form: {
      username: {
        required,
        length: (u) => minLength(3)(u) && maxLength(8)(u),
        alpha,
      },
      firstName: {
        required,
        length: (u) => minLength(1)(u),
        alpha,
      },
      lastName: {
        required,
        length: (u) => minLength(1)(u),
        alpha,
      },
      country: {
        required,
      },
      password: {
        required,
        length: (p) => minLength(5)(p) && maxLength(10)(p),
        containsNumber,
        containsSpecial,
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
      email: {
        required,
        email,
      },
      image: {
        url,
      },
    },
  },
  mounted() {
    // console.log("mounted");
    this.countries.push(...countries);
    // console.log($v);
  },
  methods: {
    previewImage: function(event) {
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.imageData = e.target.result;
          this.$root.store.profilePicture = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    },

    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async Register() {
      if (this.file == null) {
        console.log(1);
        this.file =
          "https://res.cloudinary.com/dvwtxituk/image/upload/v1594999752/profile_vpibiw.png";
        this.form.image = this.imageData;
      }
  

      try {
        const response = await this.axios.post(
          // "https://test-for-3-2.herokuapp.com/user/Register",
          this.$root.store.base_url + "/Register",
          {
            username: this.form.username,
            password: this.form.password,
            firstname: this.form.firstName,
            lastname: this.form.lastName,
            country: this.form.country,
            email: this.form.email,
            image: this.form.image,
          }
        );
        this.$router.push("/login");
        // console.log(response);
      } catch (err) {
        console.log(err.response);
        this.form.submitError = err.response.data.message;
      }
    },
    onRegister() {
      // console.log("register method called");
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      // console.log("register method go");
      this.Register();
    },
    onReset() {
      this.form = {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        password: "",
        confirmedPassword: "",
        email: "",
        image: "",
      };
      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  // padding-top: 20px;
  max-width: 500px;
  //background-color: rgba(202, 168, 218, 0.4);
  // background-color: rgba(220, 216, 240, 0.4);
  //  border: 3px solid white;
  //  border-radius: 35px;
   
  //  box-shadow: 10px 10px rgba(133, 132, 141, 0.4);
  
  
}
.mt-2{
   font-weight: bold;
   font-size: 18px;
   color: black;
   padding: 20px;
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
