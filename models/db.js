const { Client } = require("pg");
module.exports.client = new Client({
  // naming export system
  user: "fitness_app_hxwd_user",
  host: "dpg-crmpe82j1k6c739bqcig-a.oregon-postgres.render.com",
  database: "fitness_app_hxwd",
  password: "DJ6p0UifNdhTglGcxuVKsUqLKe5f2zq4",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});
