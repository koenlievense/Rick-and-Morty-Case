module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"), // Deze werkt ook voor Chromium
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      jasmine: {
        // Hier kun je enkele Jasmine-opties instellen
      },
      clearContext: false, // Laat Jasmine Spec Runner de HTML niet wissen
    },
    jasmineHtmlReporter: {
      suppressAll: true, // Verwijdert de logbalk
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage/your-angular-project"),
      subdir: ".",
      reporters: [{ type: "html" }, { type: "text-summary" }],
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromiumHeadless"], // Gebruik 'ChromiumHeadless'
    singleRun: false,
    restartOnFileChange: true,
  });
};
