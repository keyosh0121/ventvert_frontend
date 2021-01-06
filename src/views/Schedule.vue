<template lang="pug">
  div
    v-parallax(src='https://cdn.vuetifyjs.com/images/parallax/material.jpg' height=200)
      v-row(align='center', justify='center')
        v-col.text-center(cols='12')
          h1.display-1.font-weight-thin.mb-4
            | Schedule
          h4.subheading.font-weight-thin
            | 日程の連絡や予定
    v-container
      v-expansion-panels
        v-expansion-panel(focusable)
          v-expansion-panel-header 新規追加
          v-expansion-panel-content 
            v-text-field(label="内容" v-model="content")
            v-row
              v-col
                v-text-field(label="日付" type='date' v-model="date")
              v-col
                v-text-field(label="時間" type='time' v-model="time")
            v-btn(@click="addSchedule") 追加
      v-timeline.pa-0.ma-0(dense)
          v-timeline-item.ma-0.pa-0(v-bind:color="schedule.color" small v-for="schedule in schedules")
            v-list-item
              v-list-item-content
                .caption {{schedule.date}} 
                  br
                  | {{schedule.content}}
                .caption {{schedule.user.email.substring(0,8)}}
              v-list-item-action
                v-btn(icon x-small color="red" v-if="isSelfCreatedSchedule(schedule)" @click="deleteSchedule(schedule)")
                  v-icon mdi-delete
</template>
<script>
  import Store from '@/store/index.js'
  export default{
    name: 'Schedule',

    data() {
      return {
        schedules: [],
        loading: true,
        date: null,
        time:null,
        content: ""
      }
    },

    created(){
      this.getSchedules();
    },

    methods: {
      getSchedules(){
        const headers = {"Authorization": Store.state.userToken};

        this.loading = true;

        this.axios.get('/schedules/',
          {
            headers: headers,
          }
        )
          .then((response) => {
            console.log(response);
            this.schedules = response.data;
          })
          .catch((e) => {
            alert(e);
          });
        this.loading = false;
      },
      addSchedule(){
        const headers = {"Authorization": Store.state.userToken};

        this.axios.post('/schedules/',
          {
            schedule: {
              time: this.amount,
              content: this.content,
              date: this.date,
              user_id: Store.state.userId,
            }
          },
          {
            headers: headers
          }
        )
          .then((response) => {
            this.getSchedules();
          })
          .catch((e) => {
            alert(e);
          });
      },
      deleteSchedule(schedule){
        const headers = {"Authorization": Store.state.userToken};

        this.axios.delete('/schedules/' + schedule.id,
          {
            headers: headers
          }
        )
          .then((response) => {
            this.getSchedules();
          })
          .catch((e) => {
            alert(e);
          });
      },
      isSelfCreatedSchedule(schedule){
        if (schedule.user.id == Store.state.userId) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
</script>
