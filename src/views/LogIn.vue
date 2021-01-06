<template lang="pug">
  div
    v-parallax(src='https://cdn.vuetifyjs.com/images/parallax/material.jpg' height=200)
      v-row(align='center', justify='center')
        v-col.text-center(cols='12')
          h1.display-1.font-weight-thin.mb-4
            | Log in
          h4.subheading.font-weight-thin
            | ユーザログイン
    v-container
      v-card
        v-container.pa-4.text-center
          v-text-field(label="email" prepend-icon="mdi-account" type="email"   v-model="email")
          v-text-field(label="password" prepend-icon="mdi-key" type="password" v-model="password")
          v-btn(label="Log In" @click="login") Log In
          v-container(height=50)
</template>
<script>
  import Store from '@/store/index.js'
  export default{
    name: 'LogIn',
    data() {
      return{
        email: "",
        password: ""
      }
    },
    methods: {
      login(){
        this.axios.post('/login',{
          email: this.email,
          password: this.password
          })
          .then((response) => {
            console.log(response);
            if (!response.data.error && response.status == 200) {

              Store.state.userId = response.data.user_id;
              Store.state.userToken = response.data.access_token;
              if (this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect)
              }
            } else {
              alert("login failed");
            }
          })
          .catch((e) => {
            alert(e);
          });
      }
    },
    
  }
  

</script>