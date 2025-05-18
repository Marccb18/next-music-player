import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const trackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    group: { type: objectId, ref: 'Groups' },
    image: { type: String, required: false },
    url: { type: String, required: true },
    spotifyId: { type: String, required: true, message: 'Spotify ID is required' },
    release: {
      type: objectId,
      ref: 'Release',
    },
    collaborators: [
      {
        type: objectId,
        ref: 'Groups',
      },
    ],
    duration: { type: Number, required: true },
    genre: [{ type: objectId, ref: 'Genres' }],
    trackNumber: { type: Number },
    isExplicit: { type: Boolean, default: false },
    _createdAt: { type: Date, default: Date.now },
    _updatedAt: { type: Date, default: Date.now },
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

trackSchema.plugin(toJSON);

export const Track = mongoose.models.Track || mongoose.model('Track', trackSchema);
