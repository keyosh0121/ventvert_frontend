<template lang="pug">
  v-container
    v-simple-table.d-none.d-md-block
      template(v-slot:default="")
        thead
          tr
            th.text-left ID
            th.text-left 借主
            th.text-left 内容
            th.text-left 金額
            th.text-left 期日
            th.text-left Actions
        tbody
          tr(v-for="item in lendings" :key="item.id")
            td {{ item.id }}
            td {{ item.lender_id}}
            td {{ "貸し借りの内容 をここに記載" }}
            td {{ item.amount }}
            td {{ item.due_date }}
            td
              v-btn.px-2(icon) 
                v-icon mdi-delete
              v-btn.px-2(icon) 
                v-icon mdi-message-alert-outline
              v-btn.px-2(icon) 
                v-icon mdi-checkbox-marked-circle-outline
    v-container.d-md-none.pa-0
      v-card.grey.lighten-4.pa-1.my-2(v-for="item in lendings" :key="item.id")
        v-card-title.bold ¥{{ item.amount.toLocaleString() }}
        v-card-subtitle {{ item.due_date }} ( 貸し借りの内容 )
        v-card-actions
          v-row.pa-0.ma-0
            v-col.pa-0.ma-1
              v-btn.blue-grey.lighten-3(width="100%" outlined)
                v-icon mdi-delete
            v-col.pa-0.ma-1
              v-btn(width="100%" outlined)
                v-icon mdi-message-alert-outline
            v-col.pa-0.ma-1
              v-btn.light-green(width="100%" outlined @click="dialogComplete = true")
                v-icon mdi-checkbox-marked-circle-outline
    v-dialog(v-model="dialogComplete" max-width="290")
      v-card.pa-2
        v-card-title.headline 支払い完了
        v-card-text 支払いを完了しますが、よろしいですか？
        v-card-actions
          v-spacer
          v-btn(color="gray darken-1" text="" @click="dialogComplete = false")
            | キャンセル
          v-btn.success(@click="dialogComplete = false")
            | 完了



</template>      

<script>
  import axios from 'axios'
  export default {
    name: 'HelloWorld',
    mounted(){
      axios
        .get("http://localhost:3000/lendings.json")
        .then(response => (this.lendings = response.data))
    },
    data: () => ({
      lendings: [{"id":3,"lender_id":1,"creditor_id":2,"amount":10280,"due_date":"2020-05-26","lending_category_id":1,"created_at":"2020-04-18T09:12:52.004Z","updated_at":"2020-04-18T09:12:52.004Z"},{"id":4,"lender_id":2,"creditor_id":1,"amount":14960,"due_date":"2020-05-16","lending_category_id":4,"created_at":"2020-04-18T09:12:52.013Z","updated_at":"2020-04-18T09:12:52.013Z"},{"id":5,"lender_id":1,"creditor_id":2,"amount":7290,"due_date":"2020-05-08","lending_category_id":2,"created_at":"2020-04-18T09:12:52.019Z","updated_at":"2020-04-18T09:12:52.019Z"},{"id":6,"lender_id":2,"creditor_id":1,"amount":2420,"due_date":"2020-05-24","lending_category_id":5,"created_at":"2020-04-18T09:12:52.026Z","updated_at":"2020-04-18T09:12:52.026Z"},{"id":7,"lender_id":1,"creditor_id":2,"amount":16680,"due_date":"2020-05-30","lending_category_id":3,"created_at":"2020-04-18T09:12:52.033Z","updated_at":"2020-04-18T09:12:52.033Z"},{"id":8,"lender_id":2,"creditor_id":1,"amount":7040,"due_date":"2020-05-13","lending_category_id":3,"created_at":"2020-04-18T09:12:52.039Z","updated_at":"2020-04-18T09:12:52.039Z"},{"id":9,"lender_id":1,"creditor_id":2,"amount":9220,"due_date":"2020-05-22","lending_category_id":4,"created_at":"2020-04-18T09:12:52.045Z","updated_at":"2020-04-18T09:12:52.045Z"},{"id":10,"lender_id":2,"creditor_id":1,"amount":140,"due_date":"2020-05-30","lending_category_id":2,"created_at":"2020-04-18T09:12:52.058Z","updated_at":"2020-04-18T09:12:52.058Z"},{"id":11,"lender_id":1,"creditor_id":2,"amount":14290,"due_date":"2020-05-25","lending_category_id":3,"created_at":"2020-04-18T09:12:52.064Z","updated_at":"2020-04-18T09:12:52.064Z"},{"id":12,"lender_id":2,"creditor_id":1,"amount":8710,"due_date":"2020-05-25","lending_category_id":3,"created_at":"2020-04-18T09:12:52.070Z","updated_at":"2020-04-18T09:12:52.070Z"}],
      dialogComplete: false
    }),
  }
</script>
