import mongoose from 'mongoose';

import toJSON from './plugins/toJSON';

const objectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    covers: {
      type: [String],
      maxlength: 4,
    },
    owner: { type: objectId, ref: 'Users', required: true },
    isPublic: { type: Boolean, default: true },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalSongs: {
      type: Number,
      default: 0,
    },
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

// H O O K S

playlistSchema.pre(['updateOne', 'save'], async function (this: any, next) {
  try {
    if (this.songs && this.songs.length > 0) {
      //@ts-ignore
      const trackIds = this.songs.map((song) => song.track);
      const tracks = await mongoose.model('Tracks').find({ _id: { $in: trackIds } });

      this.totalDuration = tracks.reduce((total, track) => total + track.duration, 0);
      this.totalSongs = this.songs.length;

      // Generar portadas automáticas
      if (!this.covers || this.covers.length === 0) {
        // Si hay canciones, intentar crear collage
        const uniqueCovers = [...new Set(tracks.map((track) => track.image).filter(Boolean))];

        if (uniqueCovers.length > 0) {
          // Tomar máximo 4 portadas únicas
          this.covers = uniqueCovers.slice(0, 4);
        } else {
          // Si no hay portadas, generar degradado basado en el título
          const hash = this.name.split('').reduce((acc: number, char: string) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
          }, 0);

          const hue = Math.abs(hash % 360);
          this.covers = [
            `linear-gradient(45deg, hsl(${hue}, 70%, 50%), hsl(${hue + 60}, 70%, 50%))`,
          ];
        }
      }
    } else {
      this.totalDuration = 0;
      this.totalSongs = 0;

      // Si no hay canciones, generar degradado basado en el título
      if (!this.covers || this.covers.length === 0) {
        const hash = this.name.split('').reduce((acc: number, char: string) => {
          return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        const hue = Math.abs(hash % 360);
        this.covers = [`linear-gradient(45deg, hsl(${hue}, 70%, 50%), hsl(${hue + 60}, 70%, 50%))`];
      }
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

playlistSchema.plugin(toJSON);

export const Playlists = mongoose.models.Playlists || mongoose.model('Playlists', playlistSchema);
