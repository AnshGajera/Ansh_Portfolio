#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Please set MONGODB_URI in environment before running this script.');
    process.exit(1);
}

async function main() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    console.log('Connected to database:', db.databaseName);

    const projects = await db.collection('projects').find({}).toArray();
    console.log(`Found ${projects.length} project(s):`);

    projects.forEach((p, i) => {
        console.log(`--- Project ${i + 1} ---`);
        console.log('title:', p.title);
        console.log('slug :', p.slug);
        console.log('active:', p.active);
        console.log('ID   :', p._id.toString());
    });

    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
