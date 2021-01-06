<template lang="pug">
  div
    v-parallax(src='https://cdn.vuetifyjs.com/images/parallax/material.jpg' height=200)
      v-row(align='center', justify='center')
        v-col.text-center(cols='12')
          h1.display-1.font-weight-thin.mb-4
            | Notification
          h4.subheading.font-weight-thin
            | お知らせ・伝達事項
    v-container
      v-expansion-panels
        v-expansion-panel(focusable)
          v-expansion-panel-header 新規追加
          v-expansion-panel-content 
            v-text-field(label="タイトル" v-model="title")
            v-textarea(label="内容" solo v-model="content")
            v-checkbox(label="メール通知＆新着表示" v-model="alert")
            v-btn(@click="addNotification") 追加
      v-list
        v-list-item(v-for="notif in notifications")
          v-list-item-avatar
            v-icon(dark :color='notif.unopened? "teal" : "teal lighten-4" ') mdi-message
          v-list-item-content
            v-list-item-title( @click='openDialog(notif)') {{ notif.title }}
            v-list-item-subtitle(display="block") 
              span {{notif.created_at}}
              br
              span.text--primary {{ notif.user.email.substr(0,8) }} -  
              span {{ notif.content }}
          v-list-item-action
            v-btn(icon color="red")
              v-icon(@click="deleteNotification(notif)") mdi-delete
    v-dialog(v-model='dialog' @click:outside='closeDialog')
      v-card(v-if='selectedNotification')
        v-card-title {{ selectedNotification.title }}
        v-card-text {{ selectedNotification.content }}
        v-card-actions
          v-btn(text @click='closeDialog') {{ selectedNotification.unopened ? 'Mark as read':'Close' }}

</template>
<script>
  import Store from '@/store/index.js'
  export default{
    name: 'Notification',

    data() {
      return {
        title: "",
        content: "",
        alert: true,
        notifications: [],
        selectedNotification: null,
        dialog: false
      }
    },
    methods: {
      getNotifications(){
        const headers = {"Authorization": Store.state.userToken};
        this.loading = true;
        this.axios.get('/notifications/',
          {
            headers: headers,
          }
        )
          .then((response) => {
            console.log(response);
            this.notifications = response.data;
          })
          .catch((e) => {
            alert(e);
          });
        this.loading = false;
      },
      addNotification(){
        const headers = {"Authorization": Store.state.userToken};

        this.axios.post('/notifications/',
          {
            notification: {
              title: this.title,
              content: this.content,
              alert: this.alert,
              unopened: "true",
              user_id: Store.state.userId
            }
          },
          {
            headers: headers
          }
        )
          .then((response) => {
            this.getNotifications();
          })
          .catch((e) => {
            alert(e);
          });
      },
      deleteNotification(notification){
        const headers = {"Authorization": Store.state.userToken};

        this.axios.delete('/notifications/' + notification.id,
          {
            headers: headers
          }
        )
          .then((response) => {
            this.getNotifications();
          })
          .catch((e) => {
            alert(e);
          });
      },
      openDialog(notif){
        this.selectedNotification = notif;
        this.dialog = true;

        //メッセージに既読をつける処理(メッセージが未読の場合)
        if (this.selectedNotification.unopened) {
          const headers = {"Authorization": Store.state.userToken};
          this.axios.put('/notifications/' + this.selectedNotification.id,
            {
              unopened: false
            },
            {headers: headers}
          )
            .then((response) => {
              console.log(response);
              // this.getNotifications();
            })
            .catch((e) => {
              alert(e);
            });
        }
        
      },
      closeDialog(){

        this.selectedNotification = null;
        this.dialog = false;
        this.getNotifications();
      }
    },
    created(){
      this.getNotifications();
    }
  }
</script>