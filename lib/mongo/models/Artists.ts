import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const artistSchema = new mongoose.Schema(
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
    images: [
      {
        url: String,
        height: Number,
        width: Number,
      },
    ],
    genres: [
      {
        type: objectId,
        ref: 'Genres',
        index: true,
      },
    ],
    popularity: {
      type: Number,
      min: 0,
      max: 100,
      index: true,
    },
    type: {
      type: String,
      enum: ['artist', 'group'],
      required: true,
    },
    members: [
      {
        type: objectId,
        ref: 'Artists',
      },
    ],
    albums: [
      {
        type: objectId,
        ref: 'Releases',
      },
    ],
    singles: [
      {
        type: objectId,
        ref: 'Releases',
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

artistSchema.index({ name: 'text' });

artistSchema.plugin(toJSON);

export const Artists = mongoose.models.Artists || mongoose.model('Artists', artistSchema);
