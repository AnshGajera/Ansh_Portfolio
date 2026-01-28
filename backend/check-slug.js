const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI);
};

const projectSchema = new mongoose.Schema({}, { strict: false });
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

async function checkSlug() {
    await dbConnect();
    const slug = 'threatscope-android-malware-analysis';
    console.log(`Checking for project with slug: "${slug}"`);

    const project = await Project.findOne({ slug: slug });

    if (project) {
        console.log('FOUND:', project.title, project._id);
        console.log('Slug in DB:', project.slug);
    } else {
        console.log('NOT FOUND');
        // List similar slugs
        const allProjects = await Project.find({}, 'title slug');
        console.log('Available projects:');
        allProjects.forEach(p => console.log(` - ${p.title} (${p.slug})`));
    }

    await mongoose.disconnect();
}

checkSlug().catch(console.error);
