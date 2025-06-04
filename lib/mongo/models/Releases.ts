import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const releaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    spotifyId: {
      type: String,
      required: true,
      unique: true,
    },
    artists: [
      {
        type: objectId,
        ref: 'Artists',
        required: true,
      },
    ],
    cover: {
      type: String,
      required: false,
    },
    tracks: [
      {
        type: objectId,
        ref: 'Tracks',
      },
    ],
    releaseDate: {
      type: Date,
      required: false,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['album', 'single', 'ep'],
      index: true,
    },
    label: {
      type: String,
    },
    copyrights: [
      {
        type: String,
      },
    ],
    popularity: {
      type: Number,
      min: 0,
      max: 100,
      index: true,
    },
    genres: [
      {
        type: objectId,
        ref: 'Genres',
      },
    ],
    totalTracks: {
      type: Number,
      required: true,
    },
    releaseGroup: {
      type: String,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    _createdAt: {
      type: Date,
      default: Date.now,
    },
    _updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

releaseSchema.index({ name: 'text' });
releaseSchema.index({ spotifyId: 1 }, { unique: true });
releaseSchema.index({ releaseDate: -1 });
releaseSchema.index({ popularity: -1 });

releaseSchema.plugin(toJSON);

releaseSchema.pre(['save', 'updateOne'], async function (this: any, next) {
  try {
    if (this.tracks && this.tracks.length > 0) {
      const tracks = await mongoose.model('Tracks').find({ _id: { $in: this.tracks } });
      this.totalDuration = tracks.reduce((total, track) => total + track.duration, 0);
    } else {
      this.totalDuration = 0;
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

export const Release = mongoose.models.Release || mongoose.model('Release', releaseSchema);
