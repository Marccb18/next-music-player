import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const trackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    group: { type: objectId, ref: 'Groups', required: true },
    collaborators: [{ type: objectId, ref: 'Groups' }],
    album: { type: objectId, ref: 'Releases' },
    image: { type: String },
    url: { type: String, required: true },
    duration: { type: Number, required: true },
    spotifyId: { type: String, required: true },
    trackNumber: { type: Number, required: true },
    isExplicit: { type: Boolean, default: false },
    audioUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    genre: [{ type: objectId, ref: 'Genres' }],
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

export const Tracks = mongoose.models.Tracks || mongoose.model('Tracks', trackSchema);
