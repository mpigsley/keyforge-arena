/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const util = require('util');
const { chunk } = require('lodash');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
});

const readdir = util.promisify(fs.readdir);
const bucket = admin.storage().bucket();
const CHUNK_SIZE = 25;

const uploadImages = async () => {
  const [houses, sets] = await Promise.all([
    readdir(path.resolve(__dirname, 'houses')),
    readdir(path.resolve(__dirname, 'sets')),
  ]);

  console.log('Uploading house images');
  await Promise.all(
    houses.map(house =>
      bucket.upload(path.resolve(__dirname, 'houses', house), {
        destination: `houses/${house}`,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      }),
    ),
  );

  console.log('Uploading sets');
  await sets.reduce(
    (setPromise, set) =>
      setPromise.then(async () => {
        const cards = await readdir(path.resolve(__dirname, 'sets', set));
        const chunks = chunk(cards, CHUNK_SIZE);
        console.log(`Uploading cards for ${set} in ${chunks.length} chunks.`);
        await chunks.reduce(
          (cardPromise, chunkCards, index) =>
            cardPromise.then(async () => {
              console.log(
                `[CHUNK ${index + 1}/${
                  chunks.length
                }] Uploading cards for ${set}`,
              );
              await Promise.all(
                chunkCards.map(card =>
                  bucket.upload(path.resolve(__dirname, 'sets', set, card), {
                    destination: `sets/${set}/${card}`,
                    metadata: {
                      cacheControl: 'public, max-age=31536000',
                    },
                  }),
                ),
              );
            }),
          Promise.resolve(),
        );
      }),
    Promise.resolve(),
  );

  console.log('Finished bootstrapping');
};

uploadImages();
