module.exports = {
  siteMetadata: {
    title: `Gatsby Typescript Starter`,
  },
  plugins: [
    // Add typescript stack into webpack
    `gatsby-plugin-typescript`,
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyBGD16UaMqhMxFN1hc6n43RhNNkVxxDWgE",
          authDomain: "wordcloud-275516.firebaseapp.com",
          databaseURL: "https://wordcloud-275516.firebaseio.com",
          projectId: "wordcloud-275516",
          storageBucket: "wordcloud-275516.appspot.com",
          messagingSenderId: "208531002144",
          appId: "1:208531002144:web:9f39dbe906a877d15abd45"
        }
      }
    }
  ],
};
