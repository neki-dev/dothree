module.exports = {
  apps: [
    {
      name: "dothree",
      script: "./server.js",
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 4801,
      },
    },
  ],
};
