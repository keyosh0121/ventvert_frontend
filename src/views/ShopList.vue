<template lang="pug">
  div
    v-parallax(src='https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg' height=200)
      v-row(align='center', justify='center')
        v-col.text-center(cols='12')
          h1.display-1.font-weight-thin.mb-4
            | Shop List
          h4.subheading.font-weight-thin
            | 買い物リスト
    v-container
      v-expansion-panels
        v-expansion-panel(focusable)
          v-expansion-panel-header 新規追加
          v-expansion-panel-content 
            v-text-field(label="内容" v-model="content")
            v-container
              v-row
                v-col.text-center(v-for="icon in icons")
                  v-btn(:color="icon.name == iconName ? 'orange' : 'grey'" icon @click="setIcon(icon.name)")
                    v-icon {{ icon.name }}
            v-divider
            v-container
              v-row
                v-col.text-center(v-for="color in colors")
                  v-btn(:color='color' fab x-small elevation=0 @click="setColor(color)")
                    v-icon(v-if="color == colorName") mdi-check
            v-btn(@click="addShopListItem") 追加
    
    v-container
      h2 買い物リスト
      v-list(subheader)
        v-divider
        v-list-item(v-for="item in shopListItems")
          v-list-item-avatar.pr-4
            v-icon(:color="item.color") {{ item.icon }}
          v-list-item-title.caption.font-weight-bold {{ item.content }}
           v-list-item-subtitle.caption {{ item.user.email.substr(0,8) }}
          v-list-item-action
            v-btn(icon @click="deleteShopListItem(item)")
              v-icon mdi-delete
          
                


</template>
<script>
  import Store from '@/store/index.js'
  export default {
    name: "ShopList",
    data(){
      return {
        iconName: "",
        content: "",
        colorName: "",
        icons:[
          {name: "mdi-food",         num: 1},
          {name: "mdi-beer",         num: 2},
          {name: "mdi-paper-roll",   num: 3},
          {name: "mdi-laptop",       num: 4},
          {name: "mdi-medical-bag",  num: 5},
          {name: "mdi-music-note",   num: 6},
          {name: "mdi-boxing-glove", num: 7},
          {name: "mdi-account",      num: 8},
        ],
        colors:[
          'blue',
          'red',
          'green',
          'yellow'
        ],
        shopListItems: [],

      }
    },
    methods:{
      setIcon(name){
        this.iconName = name;
      },
      setColor(color){
        this.colorName = color;
      },
      addShopListItem(){
        const headers = {"Authorization": Store.state.userToken};
        this.axios.post('/shop_list_items/',
          {
            shop_list_item: {
              icon: this.iconName,
              content: this.content,
              color: this.colorName,
              user_id: Store.state.userId,
            }
          },
          {
            headers: headers
          }
        )
          .then((response) => {
            this.getShopListItems();
          })
          .catch((e) => {
            alert(e);
          });
      },
      getShopListItems(){
        const headers = {"Authorization": Store.state.userToken};
        this.axios.get('/shop_list_items/',
          {
            headers: headers,
          }
        )
          .then((response) => {
            this.shopListItems = response.data; 
          })
          .catch((e) => {
            alert(e);
          });
        this.loading = false;
      },
      deleteShopListItem(item){
        const headers = {"Authorization": Store.state.userToken};
        this.axios.delete('/shop_list_items/' + item.id,
          {
            headers: headers,
          }
        )
          .then((response) => {
            this.getShopListItems();
          })
          .catch((e) => {
            alert(e);
          });
      },
    },
    

    created() {
      this.getShopListItems();
    }

  }
</script>