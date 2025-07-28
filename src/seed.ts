import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import {faker} from "@faker-js/faker";

import User from "./models/userModel";
import Category from "./models/categoryModel";
import Question from "./models/questionModel";
import connectDB from "./lib/connectDB";

dotenv.config();

connectDB();

const seedDB = async () => {
  try {
    console.log("Database seeding started...");

    console.log("Creating admin...");
    const admin = new User({
      email: faker.internet
        .email({firstName: "test", lastName: "admin"})
        .toLowerCase(),
      mobileNumber: faker.phone.number({style: "international"}),
      password: await bcrypt.hash("test@admin", 10),
      firstName: "test",
      lastName: "admin",
      username: faker.internet.username({firstName: "test", lastName: "admin"}),
      image: {
        public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
        url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
      },
      dob: faker.date
        .past({years: 30, refDate: "2000-01-01"})
        .toISOString()
        .split("T")[0],
      gender: faker.person.gender(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
      addressline: faker.location.streetAddress(),
      amount: 50000,
      status: "active",
      role: "admin",
    });
    await admin.save();
    console.log("Created admin.");

    console.log("Seeding users...");
    const users = [];
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const user = new User({
        email: faker.internet.email({firstName, lastName}).toLowerCase(),
        mobileNumber: faker.phone.number({style: "international"}),
        password: await bcrypt.hash(firstName, 10),
        firstName: firstName,
        lastName: lastName,
        username: faker.internet.username({firstName, lastName}),
        image: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        },
        dob: faker.date
          .past({years: 30, refDate: "2000-01-01"})
          .toISOString()
          .split("T")[0],
        gender: faker.person.gender(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zip: faker.location.zipCode(),
        addressline: faker.location.streetAddress(),
        amount: faker.commerce.price({min: 100, max: 10000, dec: 0}),
        status: "active",
        role: "user",
      });
      users.push(await user.save());
    }
    console.log(`Seeded ${users.length} users.`);

    console.log("Seeding categories...");
    const categories = [];
    const categoryNames = [
      "Sports",
      "Cricket",
      "Football",
      "E-Sports",
      "Current Affairs",
    ];
    for (let i = 0; i < 10; i++) {
      const category = new Category({
        name: categoryNames[i] || faker.lorem.word({length: {min: 5, max: 10}}),
        image: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        },
      });
      categories.push(await category.save());
    }
    console.log(`Seeded ${categories.length} categories.`);

    console.log("Seeding questions...");
    const questions = [];
    for (let i = 0; i < 100; i++) {
      const randomCategory = faker.helpers.arrayElement(categories);
      const question = new Question({
        owner: admin._id,
        category: randomCategory._id,
        question: faker.company.name() + " ?",
        minBet: faker.commerce.price({min: 5, max: 50, dec: 0}),
        maxBet: faker.commerce.price({min: 100, max: 1000, dec: 0}),
        starting: faker.date.between({
          from: "2025-08-08T00:00:00.000Z",
          to: "2025-08-08T00:00:00.000Z",
        }),
        ending: faker.date.between({
          from: "2025-12-12T00:00:00.000Z",
          to: "2025-12-12T00:00:00.000Z",
        }),
      });
      questions.push(await question.save());
    }
    console.log(`Seeded ${questions.length} questions.`);

    console.log("Database seeding complete!");
  } catch (error) {
    console.log(error);
  }
};

seedDB();
