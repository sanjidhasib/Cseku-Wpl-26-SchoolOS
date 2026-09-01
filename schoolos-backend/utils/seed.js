const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Notice = require("../models/Notice");

const demoNotices = [
    {
        title: "Midterm Exam Schedule",
        description:
            "The midterm examination for all classes (6–10) will begin on September 15, 2026. Students must bring their admit cards. Classes 9 and 10 will have extended paper timings. The full timetable has been posted on the school notice board.",
        date: new Date("2026-09-05"),
        audience: "all",
        authorId: new mongoose.Types.ObjectId("000000000000000000000001"),
    },
    {
        title: "Annual Science Fair 2026",
        description:
            "The Annual Science Fair will be held on September 20, 2026 in the school auditorium. Students wishing to participate must submit their project proposals to their class teacher by September 10. Best projects will receive certificates and cash prizes.",
        date: new Date("2026-09-03"),
        audience: "students",
        authorId: new mongoose.Types.ObjectId("000000000000000000000001"),
    },
    {
        title: "School Holiday — National Day",
        description:
            "The school will remain closed on September 8, 2026 on account of the National Holiday. Regular classes will resume on September 9. Any pending assignments should be submitted on the resumption day.",
        date: new Date("2026-09-02"),
        audience: "all",
        authorId: new mongoose.Types.ObjectId("000000000000000000000001"),
    },
    {
        title: "Guardian-Teacher Meeting",
        description:
            "A Guardian-Teacher Meeting (GTM) is scheduled for September 25, 2026 from 10:00 AM to 1:00 PM. All guardians are requested to attend with the student's diary. Individual student performance will be discussed.",
        date: new Date("2026-09-04"),
        audience: "guardians",
        authorId: new mongoose.Types.ObjectId("000000000000000000000001"),
    },
    {
        title: "New Library Books Available",
        description:
            "The school library has received 200 new books covering Science, Literature, History and Mathematics. Students can borrow up to 2 books per week. Library hours are 8:00 AM – 4:00 PM on school days.",
        date: new Date("2026-08-30"),
        audience: "students",
        authorId: new mongoose.Types.ObjectId("000000000000000000000001"),
    },
    {
        title: "Sports Day Registration Open",
        description:
            "Registration for the Annual Sports Day is now open. Students from all classes can participate in track events, team sports and talent shows. Submit entry forms to the PE teacher by September 12.",
        date: new Date("2026-08-28"),
        audience: "students",
        authorId: new mongoose.Types.ObjectId("000000000000000000000001"),
    },
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Notice.deleteMany({});
    console.log("Cleared existing notices");

    const inserted = await Notice.insertMany(demoNotices);
    console.log(`Seeded ${inserted.length} demo notices`);

    await mongoose.disconnect();
    console.log("Done. Disconnect from MongoDB.");
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
