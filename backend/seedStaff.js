const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Staff = require("./models/Staff");

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/boke_glow";

const staffData = [
  {
    name: "Sarah",
    role: "Hairstylist",
    services: ["Hair Coloring", "Haircuts"],
    phone: "0712345678",
    isActive: true,
  },
  {
    name: "Jane",
    role: "Esthetician",
    services: ["Facial Treatments"],
    phone: "0798765432",
    isActive: true,
  },
  {
    name: "Joy",
    role: "Nail Artist",
    services: ["Manicure & Pedicure"],
    phone: "0755512345",
    isActive: true,
  },
  {
    name: "Mike",
    role: "Lash Specialist",
    services: ["Lash Extensions"],
    phone: "0745698765",
    isActive: true,
  },
];

async function seedStaff() {
  try {
    await mongoose.connect(MONGO_URI);

    await Staff.deleteMany({});
    await Staff.insertMany(staffData);

    console.log("Staff seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedStaff();