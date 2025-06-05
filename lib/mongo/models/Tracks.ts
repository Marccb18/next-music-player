import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const trackSchema = new mongoose.Schema(
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
    album: {
      type: objectId,
      ref: 'Releases',
      required: true,
    },
    image: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    trackNumber: {
      type: Number,
      required: true,
    },
    discNumber: {
      type: Number,
      default: 1,
    },
    isExplicit: {
      type: Boolean,
      default: false,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    genres: [
      {
        type: objectId,
        ref: 'Genres',
      },
    ],
    popularity: {
      type: Number,
      min: 0,
      max: 100,
      index: true,
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

// Mantenemos solo estas definiciones de índices
trackSchema.index({ name: 'text' });
trackSchema.index({ popularity: -1 });
trackSchema.index({ 'audioFeatures.tempo': 1 });
trackSchema.index({ 'audioFeatures.energy': 1 });

trackSchema.plugin(toJSON);

export const Tracks = mongoose.models.Tracks || mongoose.model('Tracks', trackSchema);
