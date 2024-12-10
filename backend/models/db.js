const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données établie avec succès.");
  } catch (error) {
    console.error("Impossible de se connecter à la base de données :", error);
  } finally {
    await sequelize.close();
    console.log("Connexion à la base de données fermée.");
  }
})();

module.exports = sequelize;
