<template>
  <b-col>
    <ValidationObserver v-slot="{ handleSubmit }">
      <b-card
        class="text-left"
        border-variant="success"
        header="ユーザー登録"
        header-bg-variant="success"
        header-text-variant="white"
        style="border-width:2px;"
      >
        <b-card-text>
          <p class="mb-0">あなたはまだユーザー登録が完了していません。</p>
          <p>Rakuppoを利用するにはユーザー登録を完了してください。</p>
        </b-card-text>
        <b-card-text>
          <ValidationProvider :rules="{ userName: /([^ -~｡-ﾟ])/ }" v-slot="{ errors }">
            <b-form-group label="名前" label-for="input-name" description="苗字と名前の間はスペースをあけないでください">
              <b-form-input
                id="input-name"
                type="text"
                v-model="userName"
                placeholder="ラクス太郎"
                maxlength="20"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </ValidationProvider>

          <ValidationProvider :rules="{ userNameKana: /[ぁ-ん]/ }" v-slot="{ errors }">
            <b-form-group
              label="ふりがな"
              label-for="input-name-kana"
              description="苗字と名前の間はスペースをあけないでください"
            >
              <b-form-input
                id="input-name-kana"
                type="text"
                v-model="userNameKana"
                placeholder="らくすたろう"
                maxlength="20"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </ValidationProvider>
          <b-form-group
            label="メールアドレス"
            label-for="input-email"
            description="ログイン時に入力したメールアドレスを入力してください"
          >
            <b-form-input id="input-email" type="email" v-model="mailAddress" disabled="disabled" />
          </b-form-group>
          <ValidationObserver>
            <b-form-group label="入社年月">
              <b-row>
                <b-col>
                  <ValidationProvider
                    rules="checkRequiredHireMonthYear|hireMonthYear:@month"
                    v-slot="{ errors }"
                  >
                    <b-form-select name="year" v-model="hireYear">
                      <option disabled selected>年</option>
                      <option v-for="i in selectYears" :key="i" :value="i">{{ i }}</option>
                    </b-form-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-col>
                <b-col>
                  <ValidationProvider name="month" rules="required">
                    <b-form-select name="month" v-model="hireMonth">
                      <option disabled selected>月</option>
                      <option v-for="i in hireMonthList" :key="i" :value="i">
                        {{
                        i
                        }}
                      </option>
                    </b-form-select>
                  </ValidationProvider>
                </b-col>
              </b-row>
            </b-form-group>
          </ValidationObserver>
          <div>
            <ValidationProvider rules="checkDep" v-slot="{ errors }">
              <b-form-group label="部門">
                <b-form-select v-model="depId">
                  <option disabled>部門名を選択してください</option>
                  <option
                    v-for="(dep, i) in selectDepList"
                    :key="i"
                    :value="dep.value"
                  >{{ dep.name }}</option>
                </b-form-select>
              </b-form-group>
              <small class="text-danger">{{ errors[0] }}</small>
            </ValidationProvider>
          </div>
          <b-button
            class="mr-3"
            variant="outline-success"
            :disabled="isPush"
            @click.prevent="handleSubmit(registerUser)"
          >登録</b-button>
          <b-button variant="outline-danger" @click.prevent="resetButton()">リセット</b-button>
        </b-card-text>
      </b-card>
    </ValidationObserver>
  </b-col>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
export default {
  name: "RegisterUser",
  data() {
    return {
      selectYears: [2016, 2017, 2018, 2019, 2020],
      userName: null,
      userNameKana: null,
      mailAddress: null,
      hireYear: null,
      hireMonth: null,
      depId: null,
      isPush: false
    };
  },
  computed: {
    hireMonthList() {
      var now = new Date();
      var nowYear = now.getFullYear();
      if (this.hireYear === nowYear) {
        var nowMonth = now.getMonth() + 1;
        return nowMonth;
      }
      return 12;
    },
    /** 部署一覧 */
    selectDepList() {
      return this.$store.state.depList.map(dep => ({
        name: dep.depName,
        value: dep.depId
      }));
    },
    token() {
      return this.$store.state.token;
    }
  },

  methods: {
    ...mapActions(["setLoginUser", "switchLoginStatus", "setToken"]),
    registerUser() {
      this.isPush = true;
      this.userName = this.userName.replace("　", "");
      this.userNameKana = this.userNameKana.replace("　", "");
      axios
        .post("/registerUser", {
          userName: this.userName,
          userNameKana: this.userNameKana,
          depId: this.depId,
          hireYear: this.hireYear,
          hireMonth: this.hireMonth,
          mailAddress: this.mailAddress
        })
        .then(responseUser => {
          Promise.resolve().then(() =>
            axios
              .post("/signUp", {
                mailAddress: this.mailAddress,
                password: this.mailAddress
              })
              .then(() => {
                axios
                  .post("/login", {
                    mailAddress: this.mailAddress,
                    password: this.mailAddress
                  })
                  .then(response => {
                    Promise.resolve()
                      .then(() =>
                        this.setToken(response.headers["authorization"])
                      )
                      .then(
                        () =>
                          (axios.defaults.headers.common[
                            "Authorization"
                          ] = this.token)
                      )
                      // お知らせ一覧を取得、表示用にstateに格納
                      .then(() =>
                        this.$store.dispatch(
                          "setNewsPostList",
                          response.data.postedNewsList
                        )
                      )
                      .then(() => this.setLoginUser(responseUser.data))
                      .then(() => alert("登録が完了しました！"))
                      .then(() => this.switchLoginStatus(true))
                      .then(() => this.$router.push("/home"));
                  });
              })
              .catch(error => {
                console.log(error);
              })
          );
        })
        .catch(e => {
          console.log(e);
        });
    },
    resetButton() {
      this.userName = "";
      this.userNameKana = "";
      this.hireYear = null;
      this.hireMonth = null;
      this.depId = null;
    },
    makeYearList() {
      var now = new Date();
      var nowYear = now.getFullYear();
      var startYear = 2000;
      var yearList = [];
      for (var i = startYear; i <= nowYear; i++) {
        yearList.push(i);
      }
      this.selectYears = yearList;
    }
  },
  created() {
    this.makeYearList();
  },
  mounted() {
    this.mailAddress = this.$store.state.loginUser.mailList[0].mailName;
  }
};
</script>
