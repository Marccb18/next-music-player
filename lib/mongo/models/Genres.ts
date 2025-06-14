import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    spotifyId: {
      type: String,
      unique: true,
      sparse: true,
    },
    parentGenre: {
      type: objectId,
      ref: 'Genres',
    },
    subGenres: [
      {
        type: objectId,
        ref: 'Genres',
      },
    ],
    artists: [
      {
        type: objectId,
        ref: 'Artists',
      },
    ],
    tracks: [
      {
        type: objectId,
        ref: 'Tracks',
      },
    ],
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

genreSchema.index({ name: 'text' });
genreSchema.plugin(toJSON);

export const Genre = mongoose.models.Genre || mongoose.model('Genre', genreSchema);
