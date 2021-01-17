<template lang="pug">
  div
    v-parallax(src='https://cdn.vuetifyjs.com/images/parallax/material2.jpg' height=200)
      v-row(align='center', justify='center')
        v-col.text-center(cols='12')
          h1.display-1.font-weight-thin.mb-4
            | Credit
          h4.subheading.font-weight-thin
            | 金銭の貸借管理
    v-container
      v-expansion-panels
        v-expansion-panel(focusable)
          v-expansion-panel-header 新規追加
          v-expansion-panel-content 
            v-text-field(label="内容" v-model="content")
            v-text-field(label="金額" type='number' v-model="amount")
            v-radio-group(row v-model="credit")
              v-radio(color="red" label="借りた" value="true")
              v-radio(color="green" label="貸した" value="false") 
            v-btn(@click="addCredit") 追加
      v-container.text-center.pa-4(v-if="loading")
        v-progress-circular(indeterminate)
      v-container.py-4.px-0
        
        v-menu(v-model="filter_popup" :close-on-content-click="false" nudge-left)
          template(v-slot:activator="{ on, attrs }")
            v-btn(color="indigo" v-bind="attrs" v-on="on" dark large)
              v-icon mdi-filter
              | Filter
          v-card
            v-container
              v-list
                v-list-item
                  v-list-item-action
                    v-switch(v-model="only_incomplete")
                  v-list-item-title 未完了のみ表示
                v-list-item
                  v-list-item-action
                    v-switch(v-model="show_bond")
                  v-list-item-title 貸したエントリ表示
                v-list-item
                  v-list-item-action
                    v-switch(v-model="show_credit")
                  v-list-item-title 借りたエントリ表示
      v-list(dense)
        v-list-item(v-for="credit in filteredCredits")
          v-list-item-icon
            v-icon.red--text(v-if="selfCredit(credit)" :disabled="credit.completed") mdi-arrow-right-box
            v-icon.green--text(v-else :disabled="credit.completed") mdi-arrow-left-box
          v-list-item-content(:color="credit.completed ? 'black' : 'grey'")
            template
              v-dialog(v-model="dialog" width="500")
                template(v-slot:activator="{ on, attrs }")
                  strong(v-on="on" v-bind="attrs" @click="openCreditDialog(credit)") 
                    | {{ credit.amount }}
                v-card
                  v-card-text
                    .pa-3(v-if="displayCredit")
                      h3 {{ displayCredit.amount }} 円
                      | {{ displayCredit.content }}
                      .caption 作成日時: {{ displayCredit.created_at }}
                      .caption 更新日時: {{ displayCredit.updated_at }}
                      
        
            .caption {{ credit.content}}
          v-list-item-action
            v-btn(icon color="green" v-if="!credit.completed" @click="changeCreditStatus(credit,true)")
              v-icon mdi-check
            v-btn(icon color="teal" v-if="credit.completed" @click="changeCreditStatus(credit,false)")
              v-icon mdi-undo
          v-list-item-action
            v-btn(icon v-bind:color="credit.completed?'grey':'red'" @click="deleteCredit(credit)" :disabled="credit.completed")
              v-icon mdi-delete
      v-pagination.my-4(:length="length" v-model="page" @input="pageChanged")



</template>
<script>
  import Store from '@/store/index.js'
  export default{
    name: 'Credit',
    data(){
      return {
        page: 1,
        length: 0,
        total: 0,
        count: 10,
        loading: true,
        credits: [],
        filter_popup:false,
        only_incomplete: false,
        show_credit: true,
        show_bond: true,
        amount: null,
        content: "",
        credit: "false",
        dialog: false,
        displayCredit: null,
      }
    },
    computed: {
      filteredCredits(){
        var result = this.credits 
        if (!this.show_credit){
          result = result.filter((credit) =>  !this.selfCredit(credit) );
        }
        if (!this.show_bond){
          result = result.filter((credit) =>  this.selfCredit(credit) );
        }
        if (this.only_incomplete){
          result = result.filter((credit) =>  !credit.completed );
        }
        return result;
      },
      sumOfFilteredCredits(){
        return this.filteredCredits.reduce((sum,e) => sum + e.amount, 0); 
      }
    },
    methods:{
      openCreditDialog(credit){
        this.displayCredit = credit;
        this.dialog = true;
      },
      closeCreditDialog(){
        this.displayCredit = null;
        this.dialog = false;
      },
      getCredits(page,count){
        this.loading = true;

        const headers = {"Authorization": Store.state.userToken};

        this.axios.get('/credits/',
          {
            params: {
              page: String(this.page),
              count: String(this.count)
            },
            headers: headers,
          }
        )
          .then((response) => {
            this.credits = response.data.credits;
            this.total = response.data.count;
            this.length = (this.total / 10) + 1;
          })
          .catch((e) => {
            alert(e);
          });
        this.loading = false;
      },
      addCredit(){
        const headers = {"Authorization": Store.state.userToken};
        this.axios.post('/credits/',
          {
            credit: {
              amount: this.amount,
              content: this.content,
              credit: this.credit,
              created_user_id: Store.state.userId,
              completed: false,
            }
          },
          {
            headers: headers
          }
        )
          .then((response) => {
            this.getCredits();
            this.amount = null;
            this.content = "";
          })
          .catch((e) => {
            alert(e);
          });
      },
      pageChanged(){
        this.getCredits(this.page,this.count);
      },
      selfCredit(credit){
        //自分の債務かどうかを判定する
        var id = Store.state.userId;
        if ((credit.credit && id == credit.created_user_id) || (!credit.credit && id != credit.created_user_id)) {
          return true;
        } else { 
          return false;
        }
      },
      changeCreditStatus(credit,completed){
        // Update Credit 
        const headers = {"Authorization": Store.state.userToken};
        this.axios.put('/credits/' + credit.id,
            {
              credit : {
                completed: completed,
              }
            },
            {
              headers: headers
            }
          )
          .then((response) =>  {
            this.getCredits();
          })
          .catch((e) => {
            alert(e);
          });
      },
      deleteCredit(credit){
        // Delete Credit
        const headers = {"Authorization": Store.state.userToken};
        this.axios.delete('/credits/' + credit.id,
            {
              headers: headers
            }
          )
        .then((response)=>{
          this.getCredits();
        })
        .catch((e) => {
          alert(e);
        })
      }
    },
    created(){
      this.getCredits(1,10);
    },


  }
</script>