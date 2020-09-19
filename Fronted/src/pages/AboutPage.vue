<template>
<div class="container">
        <div class="about-body">
          <p class="about-title">About Us</p>
          <b-row columns>
            <b-col >
                <div class="about-body-link">
                  <p class="title">We are Doron Shami & Oscar Epshtein</p>
                  <p class="title"> This is our final project in our Web Development course.</p>
                  <p class="title">Previous Projects:</p>
                  
                     <a id="link" href="https://sise-web-development-environments.github.io/assignment2-doron_oscar/">Pacman Game </a>
                     <br>
                     <a id="link" href="https://github.com/SISE-Web-Development-Environments/206228462">  Oscar's Site</a>
                    <br>
                     <a id="link" href="https://github.com/SISE-Web-Development-Environments/312538325">Dorons's Site</a>
                </div>
            </b-col>
          </b-row>
       </div>
      </div>
</template>

<script>
export default {};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Overpass");
.title {
  font-family: Overpass;
  text-align: center;
  font-size: 28px;
}
.about-title {
  font-family: Overpass;
  text-align: center;
  font-size: 45px;
}
.about-body-link{
  font-family: Overpass;
  text-align: center;
  font-size: 15px;
}
.about-body{
  background-color: rgba(228, 240, 245, 0.3);
  padding-bottom: 40px;
}

#link{
  font-size: 20px;
  
}
</style>