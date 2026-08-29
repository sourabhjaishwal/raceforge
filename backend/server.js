require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./config/database");

const start = async () => {
  try {
    await connectToDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

start();
