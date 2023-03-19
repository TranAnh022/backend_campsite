const CampSite=require("../models/campingSite");
const mongoose1 = require("mongoose");

const dbUrl1 = process.env.MONGO_URL || "mongodb://localhost:27017/campsite";
mongoose1.connect(dbUrl1, {
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db1 = mongoose.connection;

db1.on("error", console.error.bind(console, "connection error:"));
db1.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await CampSite.deleteMany({});
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new CampSite({
      author: "61d62da8cd16ed16742f1592",
      location: `New York, New York`,
      title: `Forest Village`,
      images: {
        url: "https://res.cloudinary.com/dirbmyqcl/image/upload/v1642589854/YelpCamp/sv2sj0ckpqantlgw2cne.jpg",
        fileName: "YelpCamp/sv2sj0ckpqantlgw2cne",
      },
      geometry: {
        type: "Point",
        coordinates: [-74.0059413, 40.7127837],
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
    });
    await camp.save();

};

seedDB().then(() => {
  mongoose.connection.close();
});
