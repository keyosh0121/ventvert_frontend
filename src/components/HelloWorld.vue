<template lang="pug">
  v-container
    v-data-table(v-if="lendings", :headers="headers", :items="lendings" dense)
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
      lendings: null,
      headers: [
        {text: "ID",value: "id"},
        {text: "借主",value: "lender_id"},
        {text: "債権者",value: "creditor_id"},
        {text: "金額",value: "amount"},
        {text: "カテゴリ",value: "lending_category_id"},
      ]
    }),
  }
</script>
