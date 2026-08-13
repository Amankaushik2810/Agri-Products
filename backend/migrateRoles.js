const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = "mongodb+srv://agriproductcapstone:OzZj3LyLLBBqe6Od@cluster0.8efdqnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    migrateRoles();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const migrateRoles = async () => {
  try {
    const usersWithUserType = await User.find({ userType: { $exists: true } });

    for (const user of usersWithUserType) {
      user.role = user.userType;
      user.userType = undefined;
      await user.save();
    }

    const usersWithoutRole = await User.find({ role: { $exists: false } });

    for (const user of usersWithoutRole) {
      user.role = "User";
      await user.save();
    }

    console.log("✅ Role migration complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};
