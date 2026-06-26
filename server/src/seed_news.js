import mongoose from 'mongoose';
import News from './models/newsModel.js';
import dotenv from 'dotenv';
dotenv.config();

const seedNews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testseries');
    console.log("Connected to MongoDB...");

    // Clear existing news
    await News.deleteMany();

    const dummyNews = [
      {
        title: "UN Affairs General Assembly President urges Europeans to 'stand up' for the UN",
        category: "INTERNATIONAL",
        description: "The President of the UN General Assembly has called on European nations to take a leading role in defending the international rules-based order.",
        fullContent: `The President of the UN General Assembly has called on European nations to take a leading role in defending the international rules-based order. 
        In a recent address, he emphasized that the United Nations remains the most important platform for global cooperation.
        
        "Europe has a historical responsibility to support the UN," he stated. "We are facing unprecedented global challenges, from climate change to rising geopolitical tensions. Only through collective action can we address these issues effectively."
        
        He also highlighted the need for UN reform to ensure the organization remains relevant in the 21st century. "The world has changed significantly since 1945. Our institutions must evolve to reflect today's realities and give a stronger voice to the Global South."
        
        The speech was met with mixed reactions, with some praising his call for unity while others questioned the practicalities of his reform proposals.`,
        author: "Global News Desk"
      },
      {
        title: "Maharashtra Government Announces New Education Reforms for 2026",
        category: "STATE NEWS",
        description: "New policy focuses on digital literacy and vocational training in secondary schools across Maharashtra.",
        fullContent: `The Government of Maharashtra has unveiled a comprehensive education reform package aimed at modernizing the state's school system.
        
        The new policy, scheduled for phased implementation starting mid-2026, places heavy emphasis on digital literacy from a young age. Every secondary school will be equipped with modern computer labs and high-speed internet.
        
        "We want our students to be future-ready," said the Education Minister. "This isn't just about computers; it's about critical thinking, problem-solving, and preparing them for the digital economy."
        
        Additionally, the reforms introduce vocational training courses in fields like coding, sustainable farming, and digital marketing. The goal is to bridge the gap between academic learning and industry requirements.
        
        Experts have welcomed the move, noting that it aligns with the National Education Policy while addressing state-specific challenges.`,
        author: "Regional Correspondent"
      }
    ];

    await News.insertMany(dummyNews);
    console.log("Dummy news articles seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding news:", err);
    process.exit(1);
  }
};

seedNews();
