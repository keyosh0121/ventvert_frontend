<template lang="pug">
  div
    v-parallax(src='https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg' height=200)
      v-row(align='center', justify='center')
        v-col.text-center(cols='12')
          h1.display-1.font-weight-thin.mb-4
            | Bugs & Requests
          h4.subheading.font-weight-thin
            | バグレポート・機能追加 入力フォーム
    v-container
      v-select( :items='selections' label='カテゴリ' v-model='category')
      v-text-field(v-model='title' label="タイトル" required)
      v-textarea(v-model='content' label="内容" outlined)
      v-btn(@click='sendReport' label="送信") 送信
    v-dialog(v-model='completed')
      v-card
        v-card-title 送信完了
        v-card-text 報告ありがとうございます。チケットが起票され、対応状況はツール上で確認可能です。
        v-card-actions
          v-btn(text @click='completed = false') CLOSE
      
</template>
<script>
  import Store from '@/store/index.js'
  export default {
    name: "Reports",
    data(){
      return {
        title: '',
        content: '',
        category: '',
        selections: ['バグ','機能追加'],
        completed: false,
      }
    },
    methods: {
      sendReport(){
        const headers = {"Authorization": Store.state.userToken};

        this.axios.post('/reports/',
          {
            report: {
              title: this.title,
              content: this.content,
              category: this.category,
              user_id: Store.state.userId
            }
          },
          {
            headers: headers
          }
        )
          .then((response) => {
            this.completed = true;
            this.content = "";
            this.title = "";
            this.category = "";
          })
          .catch((e) => {
            alert(e);
          });
      }
    }
  }

</script>