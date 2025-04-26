import mongoose from 'mongoose';
import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  group: { type: objectId, ref: 'Groups' },
  audioFile: {
    type: {
      url: {
        type: String,
        trim: true,
        // required: true,
      },
      metadata: {
        name: {
          type: String,
          trim: true,
          // required: true,
        },
        type: {
          type: String,
          trim: true,
        },
        size: {
          type: Number,
          trim: true,
        },
      },
      bucketRef: {
        type: String,
        trim: true,
        private: true,
      },
    },
    // select: false,
    _id: false,
  },
  releases: [
    {
      type: objectId,
      ref: 'Release',
    },
  ],
  collaborators: [
    {
      type: objectId,
      ref: 'Groups',
    },
  ],
  _createdAt: { type: Date, default: Date.now },
  _updatedAt: { type: Date, default: Date.now },
}, {
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