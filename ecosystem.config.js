module.exports = {
  apps: [
    {
      name: "auth-api",
      script: "dist/server.js", // Ou o arquivo principal da sua API
      watch: true, // Reinicia ao detectar mudanças
    },
  ],
};
