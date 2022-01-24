module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    'plugin:vue/vue3-recommended',
    "plugin:vue/vue3-strongly-recommended"
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: [
    'vue',
  ],
  rules: {
    "vue/max-attributes-per-line": ["error", {
      "singleline": {
        "max": 5,
        "allowFirstLine": true
      },
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      },
    }],
    "vue/singleline-html-element-content-newline": ["error", {
      "ignoreWhenNoAttributes": true,
      "ignoreWhenEmpty": false,
      "ignores": ["p", "div", "van-loading", "h1", "van-button"]
    }]
  },
};
