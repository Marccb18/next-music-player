import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    cover: {
      type: String,
      required: true,
      trim: true,
      default: null,
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

groupSchema.plugin(toJSON);

export const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);
