<template>
  <v-data-table :headers="headers" :items="employees" class="elevation-1 card">
    <template v-slot:item.depId="{ item }">
      <span>{{ transferDepName(item.depId) }}</span>
    </template>
    <template v-slot:item.update="{ item }">
      <router-link
        :to="{
          name: 'UpdateUserForm',
          query: { item: encodeURIComponent(JSON.stringify(item)) },
        }"
      >
        <v-fa :icon="['fas', 'edit']" size="lg" class="edit"></v-fa>
      </router-link>
    </template>
    <template v-slot:item.delete="{ item }">
      <v-fa
        :icon="['fas', 'trash-alt']"
        size="lg"
        @click="deleteConfirm(item)"
        color="grey"
        class="delete"
      ></v-fa>
    </template>
  </v-data-table>
</template>

<script>
import firebase from "firebase/app";
import { mapActions } from "vuex";
import Status from "@/assets/js/Status";
import axios from "axios";
export default {
  props: {
    employeeList: Array,
  },
  computed: {
    employees() {
      return this.items;
    },
  },
  watch: {
    employeeList: function() {
      this.items = this.employeeList;
    },
  },
  data() {
    return {
      headers: [
        {
          value: "name",
          text: "名前",
          sortable: true,
        },
        {
          value: "kana",
          text: "ふりがな",
          sortable: true,
        },
        {
          value: "mail",
          text: "メールアドレス",
          sortable: true,
        },
        {
          value: "depId",
          text: "部署名",
          sortable: true,
        },
        {
          value: "hireDate",
          text: "入社月",
          sortable: true,
        },
        {
          value: "update",
          text: "更新",
          sortable: false,
        },
        {
          value: "delete",
          text: "削除",
          sortable: false,
        },
      ],
      items: [],
      deleteStatus: Status.DELETED,
      loginUserId: this.$store.state.loginUser.userId,
    };
  },
  methods: {
    ...mapActions(["deleteUser","switchLoginStatus","resetState"]),
    deleteConfirm(user) {
      if (confirm("削除してよろしいですか？")) {
        axios
          .post("/status", {
            userId: user.userId,
            userVersion: user.version,
            updateUserStatus: this.deleteStatus,
            updateUserId: this.loginUserId,
          })
          .then(() => {
            this.deleteUser(user.userId),
              alert("削除しました")

              if(user.userId == this.$store.state.loginUser.userId) {
                firebase.auth().signOut();
                this.$router.push("/");
                this.switchLoginStatus(false);
                this.resetState();
              } else {
                this.$router.push("/adminSetting");
              }

          })
          .catch((e) => {
            alert("問題が発生しました。もう1度作業をやり直してください。" + e),
              this.$router.push("/top");
          });
      }
    },
    /** 部署IDを部署名に変換するメソッド */
    transferDepName(depId) {
      let dep = this.$store.state.depList.find((dep) => dep.depId === depId);
      return dep.depName;
    },
  },
  mounted() {
    this.items = this.employeeList;
  },
};
</script>
<style>
.theme--light.v-data-table thead tr th {
  background-color: #28a745 !important;
  color: white !important;
}
.edit:hover {
  cursor: pointer;
  color: blue;
}
.delete:hover {
  cursor: pointer;
  color: crimson;
}
</style>
