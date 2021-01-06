<template lang="pug">
  v-app
    v-app-bar.white(app dark)
      router-link(to="/" tag="div")
        v-icon.cyan--text(large) mdi-chevron-double-down
      router-link(to="/" tag="div")
        .d-flex.title.px-4.green--text VentVert
      v-spacer
      v-badge(dot offset-x=16 offset-y=16 color='orange' :value='notifCount')
        v-btn(icon)
          v-icon.green--text mdi-bell
      v-menu(left='', bottom='')
        template(v-slot:activator='{ on, attrs }')
          v-btn.green--text(icon='', v-bind='attrs', v-on='on')
            v-icon mdi-dots-vertical
        v-list
          v-list-item(v-for='menu in menus')
            router-link(v-bind:to="menu.link")
              v-list-item-title {{ menu.name }}
    v-content
      router-view
</template>

<script>
import Store from '@/store/index.js'
export default {
  name: 'App',
  data: () => ({
    menus: [
      {name: "貸借管理", link: "/credit"},
      {name: "買い物リスト", link: "/shoplist"},
      {name: "お知らせ・リマインダー", link: "/notification"},
      {name: "予定管理", link: "/schedule"},
      {name: "バグ報告", link: "/report"},
    ],
    notifications: [],
    notifCount: 0
  }),
  mounted(){
    if (Store.state.userToken != "") {
      this.getNotifInfo();
    }
  },
  methods: {
    getNotifInfo(){

      const headers = {"Authorization": Store.state.userToken};

      this.axios.get('/notifications',
        {
          params: {
            alert: "true",
          },
          headers: headers,
        }
      )
        .then((response) => {
          if (response.status == "200") {
            this.notifications = response.data;
            this.notifCount = this.notifications.count;
            console.log(this.notifications)
          } else {
            alert("could not get info");
          }
        })
        .catch((e) => {
          alert(e);
        });
    
    }
  }

}
</script>
