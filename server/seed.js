// Sample data for development.
//   node seed.js          add demo authors + sample memories (re-runnable)
//   node seed.js --undo   remove everything this script created
//
// Creates a handful of demo author accounts so the feed has several voices.
// They are ordinary accounts with a known shared password — fine for local
// development, but delete them (--undo) before pointing this at anything real.
import 'dotenv/config';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './db.js';
import PostMessage from './models/postMessage.js';
import User from './models/user.js';

const SEED_TAG = 'sample';
const DEMO_DOMAIN = '@memories.demo';

// Demo authors exist to give the feed several voices — nobody needs to sign in
// as them. With no DEMO_PASSWORD set they get an unguessable password that is
// never printed or stored, so the accounts cannot be used. Set DEMO_PASSWORD
// yourself only if you actually want to log in as one locally.
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || crypto.randomBytes(32).toString('base64url');
const DEMO_PASSWORD_IS_KNOWN = Boolean(process.env.DEMO_PASSWORD);

const photo = (id) =>
  `https://images.unsplash.com/${id}?w=600&h=338&fit=crop&q=70&auto=format`;

// Posts attributed to the first real account (yours).
const OWN_POSTS = [
  { title: 'Sunrise over Annapurna', message: 'Four hours of switchbacks in the dark, and then the whole range went pink at once.', tags: ['hiking', 'nepal', 'sunrise'], img: 'photo-1506905925346-21bda4d32df4' },
  { title: 'First espresso in Rome', message: 'Standing at the counter like a local. Paid 90 cents and felt like I had cracked a code.', tags: ['travel', 'coffee', 'italy'], img: 'photo-1495474472287-4d71bcdd2085' },
  { title: 'The old pier at dusk', message: 'Same stretch of coast every summer as kids. The light still lands exactly the way it used to.', tags: ['nostalgia', 'coast'], img: 'photo-1473116763249-2faaef81ccda' },
  { title: 'Kyoto in the rain', message: 'Everyone else ran for cover. We bought a cheap umbrella and had the whole garden to ourselves.', tags: ['japan', 'travel', 'rain'], img: 'photo-1493976040374-85c8e12f0c0e' },
  { title: 'Grandma’s recipe, finally right', message: 'Eighth attempt. Turns out the trick was browning the butter first. She never wrote that part down.', tags: ['family', 'cooking'], img: 'photo-1556909114-f6e7ad7d3136' },
  { title: 'Night train to Vienna', message: 'Bunk the size of a shelf, but waking up to fog over the Danube made up for it.', tags: ['travel', 'trains', 'austria'], img: 'photo-1474487548417-781cb71495f3' },
  { title: 'That impossible crossword', message: 'Took three of us and most of a Sunday. The last clue was "ERNE" and I am still annoyed.', tags: ['puzzles', 'sunday'], img: 'photo-1504711434969-e33886168f5c' },
  { title: 'Desert sky, no moon', message: 'Drove two hours past the last streetlight. You could read by the Milky Way.', tags: ['stars', 'desert', 'roadtrip'], img: 'photo-1444080748397-f442aa95c3e5' },
  { title: 'Harvest at the allotment', message: 'Six courgettes, one enormous marrow, and a very smug afternoon.', tags: ['garden', 'summer'], img: 'photo-1518977676601-b53f82aba655' },
  { title: 'Snow day, no school', message: 'The whole street out at once. Someone’s dad built a sledge run down the hill by noon.', tags: ['winter', 'childhood'], img: 'photo-1418985991508-e47386d96a71' },
  { title: 'Lisbon rooftops', message: 'Climbed what felt like every hill in the city for this one view. Worth it.', tags: ['portugal', 'travel', 'views'], img: 'photo-1555881400-74d7acaacd8b' },
  { title: 'The bookshop cat', message: 'Refused to move off the poetry section. We bought a novel instead.', tags: ['books', 'cats'], img: 'photo-1514888286974-6c03e2ca1dba' },
  { title: 'Low tide, early morning', message: 'Miles of wet sand and exactly one other set of footprints.', tags: ['coast', 'walking'], img: 'photo-1505142468610-359e7d316be0' },
  { title: 'Last day of the season', message: 'Legs gone by lunch. Stayed until the lifts stopped anyway.', tags: ['skiing', 'alps'], img: 'photo-1551698618-1dfe5d97d256' },
  { title: 'Rooftop, 2am', message: 'Nobody wanted to be the first to say they should go home, so nobody did.', tags: ['friends', 'summer'], img: 'photo-1514565131-fce0801e5785' },
  { title: 'Market morning', message: 'Went for bread. Came back with bread, cheese, flowers, and a clay pot I did not need.', tags: ['market', 'weekend'], img: 'photo-1488459716781-31db52582fe9' },
];

// Demo authors and their memories.
const AUTHORS = [
  {
    name: 'Mia Chen',
    posts: [
      { title: 'Cherry blossom, finally', message: 'Waited three weekends for peak bloom and nearly missed it again. Ten minutes of sun was all we got.', tags: ['spring', 'blossom', 'park'], img: 'photo-1522383225653-ed111181a951' },
      { title: 'Late shift at the studio', message: 'Centred it on the seventh try. My hands ached for two days and I would do it again tomorrow.', tags: ['pottery', 'making'], img: 'photo-1595351298020-038700609878' },
    ],
  },
  {
    name: 'Diego Alvarez',
    posts: [
      { title: 'Surf before work', message: 'Alarm at half four. Two hours in the water and I still made the 9am standup, somehow.', tags: ['surf', 'mornings', 'ocean'], img: 'photo-1502680390469-be75c86b636f' },
      { title: 'Abuela’s patio', message: 'Same plastic chairs, same lemon tree, same argument about dominoes. Nothing has changed and that is the point.', tags: ['family', 'summer'], img: 'photo-1523575708161-ad0fc2a9b951' },
    ],
  },
  {
    name: 'Amara Okafor',
    posts: [
      { title: 'Golden hour downtown', message: 'Got off the bus two stops early because the light was doing something ridiculous to the glass.', tags: ['city', 'sunset', 'walking'], img: 'photo-1519501025264-65ba15a82390' },
      { title: 'New bike, first ride', message: 'Eleven miles before I remembered I had not eaten. Worth every wobble.', tags: ['cycling', 'weekend'], img: 'photo-1485965120184-e220f721d03e' },
    ],
  },
  {
    name: 'Tom Whitfield',
    posts: [
      { title: 'The allotment shed', message: 'Inherited it with the plot. Found three decades of seed packets and a radio that still works.', tags: ['garden', 'shed'], img: 'photo-1601985705806-5b9a71f6004f' },
      { title: 'Fog on the moors', message: 'Could not see fifty feet ahead. Walked the whole ridge on faith and the sound of sheep.', tags: ['walking', 'moors', 'fog'], img: 'photo-1487621167305-5d248087c724' },
    ],
  },
  {
    name: 'Sofia Rossi',
    posts: [
      { title: 'Bakery at 6am', message: 'The queue starts before they open. Worth standing in the cold for the first tray out of the oven.', tags: ['bread', 'mornings'], img: 'photo-1509440159596-0249088772ff' },
      { title: 'Night market, second helping', message: 'Told myself one skewer. Came back three times and regret nothing.', tags: ['food', 'market', 'night'], img: 'photo-1504674900247-0877df9cc836' },
    ],
  },
];

const demoEmail = (name) => name.toLowerCase().split(' ')[0] + DEMO_DOMAIN;

const undo = async () => {
  const demoUsers = await User.find({ email: new RegExp(`${DEMO_DOMAIN}$`) }, '_id name');
  const ids = demoUsers.map((u) => String(u._id));

  const posts = await PostMessage.deleteMany({
    $or: [{ tags: SEED_TAG }, { creator: { $in: ids } }],
  });
  const users = await User.deleteMany({ email: new RegExp(`${DEMO_DOMAIN}$`) });

  console.log(`Removed ${posts.deletedCount} sample post(s) and ${users.deletedCount} demo author(s).`);
};

const upsertPost = async (spec, author, createdAt) => {
  const existing = await PostMessage.findOne({ title: spec.title });
  const fields = {
    title: spec.title,
    message: spec.message,
    tags: [...spec.tags, SEED_TAG],
    selectedFile: photo(spec.img),
    creator: String(author._id),
    name: author.name,
  };

  if (existing) {
    // Refresh the image and text but leave likes and timestamps alone.
    await PostMessage.updateOne({ _id: existing._id }, { $set: fields });
    return 'updated';
  }

  await PostMessage.create({ ...fields, likes: [], createdAt });
  return 'created';
};

const seed = async () => {
  const owner = await User.findOne({ email: { $not: new RegExp(`${DEMO_DOMAIN}$`) } }).sort({ _id: 1 });
  if (!owner) {
    console.error('No user found. Sign up in the app first, then re-run this script.');
    process.exitCode = 1;
    return;
  }

  const hashed = await bcrypt.hash(DEMO_PASSWORD, 12);
  const authors = [];

  for (const author of AUTHORS) {
    const email = demoEmail(author.name);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: author.name, email, password: hashed });
      console.log(`  created demo author: ${author.name} <${email}>`);
    } else {
      // Always reset it, so re-running the script rotates the credential.
      await User.updateOne({ _id: user._id }, { $set: { password: hashed } });
      console.log(`  reset password for: ${author.name} <${email}>`);
    }
    authors.push({ user, posts: author.posts });
  }

  // Interleave everyone's posts so the feed alternates between authors.
  const queue = [];
  OWN_POSTS.forEach((p) => queue.push({ spec: p, author: owner }));
  authors.forEach(({ user, posts }) => posts.forEach((p) => queue.push({ spec: p, author: user })));

  for (let i = queue.length - 1; i > 0; i -= 1) {
    const j = (i * 7 + 3) % (i + 1); // deterministic shuffle, stable across runs
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  const now = Date.now();
  const counts = { created: 0, updated: 0 };

  for (const [i, { spec, author }] of queue.entries()) {
    const result = await upsertPost(spec, author, new Date(now - (i + 1) * 36e5));
    counts[result] += 1;
  }

  console.log(`\n${counts.created} post(s) created, ${counts.updated} updated.`);
  console.log(`Your posts are attributed to: ${owner.name}`);
  console.log(
    DEMO_PASSWORD_IS_KNOWN
      ? 'Demo authors use the DEMO_PASSWORD you provided.'
      : 'Demo author accounts have random, unusable passwords (nothing to leak).',
  );
  console.log(`Total posts now: ${await PostMessage.countDocuments()}`);
};

const run = async () => {
  await connectDB();
  if (process.argv.includes('--undo')) await undo();
  else await seed();
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
