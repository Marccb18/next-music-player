import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    cover: { type: String, required: false },
    owner: { type: objectId, ref: 'Users', required: true },
    isPublic: { type: Boolean, default: true },
    songs: [
      {
        track: { type: objectId, ref: 'Tracks' },
        position: { type: Number },
        addedAt: { type: Date, default: Date.now },
      },
    ],
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

playlistSchema.plugin(toJSON);

export const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', playlistSchema);
