<template lang=pug>
  div
    v-parallax(src='https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg' height=200)
      v-row(align='center', justify='center')
        v-col.text-center(cols='12')
          h1.display-1.font-weight-thin.mb-4
            | Vent Vert
          h4.subheading.font-weight-thin
            | 金銭の貸借管理・買い物リスト共有アプリケーション
    v-container
      v-container(height=50)
      h2 お金の貸し借り
      div(max-width="400px")
        v-row
          v-col
            v-card.pa-4.font-weight-bold.red.lighten-5
              .caption 借りている
              span.red--text.text--darken-2 {{ credit_total }}
              span  ( {{ credit_count }} )
          v-col
            v-card.pa-4.font-weight-bold.green.lighten-5
              .caption 貸している
              span.green--text.text--darken-2 {{ bond_total }}
              span  ( {{ bond_count }} )
          v-spacer.d-none.d-sm-flex.d-md-none
      v-container(height=50)
      h2 買い物リスト
      v-list(dense)
        v-divider
        v-list-item(v-for="item in shopList")
          v-list-item-icon
            v-icon(small) {{ item.icon }}
          v-list-item-title.caption.font-weight-bold {{ item.content }}
          

        v-divider
      v-container(height=50)
      h2 直近の予定
      v-timeline(dense)
        v-timeline-item(color="blue" small v-for="schedule in schedules")
          v-row
            v-col.pa-0(cols=3)
              strong.caption {{ schedule.date }}
            v-col.pa-0(cols=9)
              .caption.font-weight-bold {{ schedule.content }}
              .caption {{ schedule.user.email.substr(0,8) }}
</template>
<script>
  import Store from '@/store/index.js'
  export default{
    name: 'TopPage',
    data(){
      return{
        credit_total: 0,
        credit_count: 0,
        bond_total: 0,
        bond_count: 0,
        schedules: [],
        shopList: []
      }
    },
    methods: {
      getCreditInfo() {

        const headers = {"Authorization": Store.state.userToken};
        const formatter  = new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: 'JPY'
        });

        this.axios.get('/credits/info',
          {
            params: {
              user_id: Store.state.userId,
            },
            headers: headers,
          }
        )
          .then((response) => {
            if (response.status == "200") {
              this.credit_total = formatter.format(response.data.credit_total);
              this.credit_count = response.data.credit_count;
              this.bond_total = formatter.format(response.data.bond_total);
              this.bond_count = response.data.bond_count;
            } else {
              alert("could not get info");
            }
          })
          .catch((e) => {
            alert(e);
          });
      },
      getScheduleInfo() {
        const headers = {"Authorization": Store.state.userToken};

        this.axios.get('/schedules',
          {
            params: {
              limit: 3
            },
            headers: headers
          }
        )
          .then((response) => {
            if (response.status == "200") {
              this.schedules = response.data
            }
          })
          .catch((e) => {});
      },
      getShopListInfo() {
        const headers = {"Authorization": Store.state.userToken};

        this.axios.get('/shop_list_items',
          {
            params: {
              limit: 3
            },
            headers: headers
          }
        )
          .then((response) => {
            if (response.status == "200") {
              this.shopList = response.data
            }
          })
          .catch((e) => {});
      },
    },
    
    created(){
      this.getCreditInfo();
      this.getScheduleInfo();
      this.getShopListInfo()
    }
  }
</script>