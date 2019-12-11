module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    // 参考https://segmentfault.com/a/1190000008742240
    "linebreak-style": [0, "windows"],//换行风格
    "space-before-function-paren": [0, "always"],//函数定义时括号前面要不要有空格
    "semi": [2, "always"],//语句强制分号结尾
  },
};
