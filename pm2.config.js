module.exports = {
  apps: [
    {
      /**
       * General
       */
      name: "dothree",
      script: "./server.js",
      max_memory_restart: "512M",

      /**
       * Environment
       */
      env: {
        NODE_ENV: "production",
        PORT: 4801,
      },

      /**
       * Logs
       */
      out_file: "./stdout.log",
      error_file: "./stderr.log",
      merge_logs: true,
      log_date_format: "DD.MM.YYYY HH:mm:ss Z",
      log_type: "json",
    },
  ],
};
