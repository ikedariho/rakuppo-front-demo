<template>
  <div>
    <v-alert
      v-if="err !== ''"
      outlined
      type="error"
      style="white-space:pre-wrap;"
      text
      >{{ err }}</v-alert
    >
    <b-card class="text-center py-3 shadow-sm" v-show="!loading">
      <b-card-text>
        <p class="display-2 font-weight-bold text-success mb-5">Rakuppo</p>
        <p>あなたの今日のコンディションを記録しましょう</p>
        <v-btn
          class="my-5 px-5 align-middle"
          outlined
          color="grey lighten-1"
          @click="login"
          style="text-transform: none;height:42px"
        >
          <div class="px-3">
            <img class="pb-1" src="@/assets/img/google_icon.png" />
            <span class="ml-1" style="color:#6a6a6a">ログイン</span>
          </div>
        </v-btn>
        <div>
          <v-btn text color="green" @click="toPage('/')">トップに戻る</v-btn>
        </div>
      </b-card-text>
    </b-card>
    <Loading v-show="loading"></Loading>
  </div>
</template>
<script>
import axios from "axios";
import firebase from "firebase/app";
import { mapActions } from "vuex";
import Loading from "@/components/common/Loading.vue";
import AUTHORITY from "@/assets/js/Authority.js";
import STATUS from "@/assets/js/Status.js";
export default {
  data() {
    return {
      name: "Login",
      err: "",
      loading: true,
    };
  },
  components: {
    Loading,
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
  },
  methods: {
    ...mapActions([
      "login",
      "setLoginUser",
      "setFirebaseUser",
      "deleteLoginUser",
      "switchLoginStatus",
      "getEmployeeList",
      "getDepList",
      "setToken",
    ]),
    toPage(path) {
      this.$router.push(path);
    },
  },
  mounted() {
    axios.defaults.headers.common["Authorization"] = "";
    this.loading = false;
    axios
      .post("/loginCheck", {
        mail: "gest@rakus-partners.co.jp",
        password: "gest@rakus-partners.co.jp",
      })
      .then((response) => {
        this.setLoginUser(response.data);
        this.getDepList(response.data.depList); //新規登録画面へ遷移
        if (response.data.authority == AUTHORITY.UNREGISTERED) {
          this.$router.push("/registerUser"); //管理者権限
        } else if (response.data.authority == AUTHORITY.ADMIN) {
          axios
            .post("/login", {
              mailAddress: "gest@rakus-partners.co.jp",
              password: "gest@rakus-partners.co.jp",
            })
            .then((apiLoginResponse) => {
              console.log(apiLoginResponse);
              this.setLoginUser(response.data);
              this.getDepList();
              this.switchLoginStatus(true);
              Promise.resolve()
                .then(() =>
                  this.setToken(apiLoginResponse.headers["authorization"])
                )
                .then(
                  () =>
                    (axios.defaults.headers.common[
                      "Authorization"
                    ] = this.token)
                )
                .then(() => this.getEmployeeList())
                .then(() => this.$router.push("/home")); //全従業員情報を取得
            });
        } else if (response.data.authority == AUTHORITY.USER) {
          axios
            .get("/login", {})
            .then((apiLoginResponse) => {
              this.setLoginUser(response.data);
              this.getDepList();
              this.switchLoginStatus(true);
              Promise.resolve()
                .then(() =>
                  this.setToken(apiLoginResponse.headers["authorization"])
                )
                .then(
                  () =>
                    (axios.defaults.headers.common[
                      "Authorization"
                    ] = this.token)
                )
                .then(() => this.$router.push("/home"));
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (response.data.authority == AUTHORITY.OUTSIDER) {
          this.deleteLoginUser();
          firebase.auth().signOut();
          this.err =
            "メールドメインがrakus-partners.co.jp\nまたはrakus.co.jpのユーザーのみログインできます";
        } else if (response.data.status == STATUS.DELETED) {
          this.deleteLoginUser();
          firebase.auth().signOut();
          this.err = "アカウントが削除されているためログインできません";
        }
      })
      .catch((error) => {
        console.log(error);
        alert("異常が発生しました。");
        this.$router.push("/");
      });
    this.loading = true;
  },
};
</script>
