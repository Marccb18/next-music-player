import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    role: { type: String, required: true, enum: ['admin', 'user'] },
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

userSchema.pre('save', function (next) {
  this.avatar =
    this.avatar ||
    'https://avatar.iran.liara.run/public?username=' + this.name.toLowerCase().replace(' ', '');
  next();
});

userSchema.plugin(toJSON);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
