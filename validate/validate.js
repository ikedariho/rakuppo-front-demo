import Vue from "vue";
// Vee-validateのインポート
import { extend,ValidationObserver, ValidationProvider } from "vee-validate";
import {digits,regex,email} from 'vee-validate/dist/rules'



// extend('required', {
//   validate (value) {
//     return {
//       required: true,
//       valid: ['', null, undefined].indexOf(value) === -1
//     };
//   },
//   computesRequired: true,
//   message:"文字列を入力して下さい"
// });

// ユーザ登録に使うvalidation
extend('regex',regex)
extend('userName',{
  ...regex,
  // ...required,
  message:"20文字以内の全角で入力してください。"
});
extend('userNameKana',{
  ...regex,
  // ...required,
  message:"20文字以内の全角平仮名で入力してください。"
});

extend('email',{
  ...email,
  message:'メールアドレスの形式ではありません'
})

extend("digits",digits)

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
