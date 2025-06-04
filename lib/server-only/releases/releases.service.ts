'use server';

import { z } from 'zod';

import { connectMongo } from '@/lib/mongo';
import { Group } from '@/lib/mongo/models/Groups';
import { Release } from '@/lib/mongo/models/Releases';
import { Tracks } from '@/lib/mongo/models/Tracks';

const trackSchema = z.object({
  name: z.string(),
  group: z.string(),
  collaborators: z.array(z.string()),
  album: z.string().optional(),
  image: z.string().nullable(),
  url: z.string(),
  duration: z.number(),
  spotifyId: z.string(),
  trackNumber: z.number(),
  isExplicit: z.boolean(),
  genre: z.array(z.string()).optional(),
  audioUrl: z.string(),
  fileName: z.string(),
});

type TrackData = z.infer<typeof trackSchema>;

export async function createTrack(trackData: TrackData) {
  try {
    await connectMongo();

    // Validar los datos de la canción
    const validatedData = trackSchema.parse(trackData);

    // Buscar o crear el grupo principal
    let group = await Group.findOne({ groupName: validatedData.group });
    if (!group) {
      group = await Group.create({
        groupName: validatedData.group,
        cover: validatedData.image,
      });
    }

    // Buscar o crear los colaboradores
    const collaboratorPromises = validatedData.collaborators.map(async (collabName) => {
      let collab = await Group.findOne({ groupName: collabName });
      if (!collab) {
        collab = await Group.create({
          groupName: collabName,
        });
      }
      return collab._id;
    });
    const collaboratorIds = await Promise.all(collaboratorPromises);

    // Crear la canción
    const track = new Tracks({
      name: validatedData.name,
      group: group._id,
      collaborators: collaboratorIds,
      image: validatedData.image,
      url: validatedData.url,
      duration: validatedData.duration,
      spotifyId: validatedData.spotifyId,
      trackNumber: validatedData.trackNumber,
      isExplicit: validatedData.isExplicit,
      audioUrl: validatedData.audioUrl,
      fileName: validatedData.fileName,
      genre: validatedData.genre || [],
    });

    await track.save();

    // Si hay un álbum, actualizarlo
    if (validatedData.album) {
      let album = await Release.findOne({ name: validatedData.album });
      if (!album) {
        album = await Release.create({
          name: validatedData.album,
          group: group._id,
          cover: validatedData.image,
          tracks: [track._id],
          type: 'album',
        });
      } else {
        album.tracks.push(track._id);
        await album.save();
      }
    }

    return {
      success: true,
      track: track.toJSON(),
    };
  } catch (error) {
    console.error('Error al crear la canción:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Datos de la canción inválidos',
        details: error.errors,
      };
    }
    return {
      success: false,
      error: 'Error al crear la canción',
    };
  }
}

export const getReleases = async ({ search }: { search?: string } = {}) => {
  try {
    await connectMongo();

    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const releases = await Release.find(query)
      .select('name artists tracks cover releaseDate type totalTracks totalDuration id')
      .populate('artists', 'name id');

    console.log('releases',releases);
    return JSON.parse(JSON.stringify(releases));
  } catch (error) {
    console.error('Error al obtener los álbumes:', error);
    throw error;
  }
};

export const getReleaseById = async (id: string) => {
  try {
    await connectMongo();

    const release = await Release.findById(id)
      .populate('artists', 'name id')
      .populate({
        path: 'tracks',
        populate: {
          path: 'artists',
          select: 'name id',
        },
      });

    if (!release) {
      throw new Error('Álbum no encontrado');
    }

    // Convertir el documento de Mongoose a un objeto plano
    const releaseObject = release.toObject();
    
    // Asegurarnos de que las fechas se serialicen correctamente
    if (releaseObject.releaseDate) {
      releaseObject.releaseDate = new Date(releaseObject.releaseDate);
    }

    // Asegurarnos de que los tracks se serialicen correctamente
    if (releaseObject.tracks) {
      releaseObject.tracks = releaseObject.tracks.map((track: any) => ({
        id: track._id.toString(),
        name: track.name,
        spotifyId: track.spotifyId,
        artists: track.artists.map((artist: any) => ({
          id: artist._id.toString(),
          name: artist.name,
        })),
        album: track.album ? {
          id: track.album._id.toString(),
          name: track.album.name,
        } : undefined,
        duration: track.duration,
        trackNumber: track.trackNumber,
        isExplicit: track.isExplicit,
        image: track.image,
        audioUrl: track.audioUrl,
        fileName: track.fileName,
      }));
    }

    return releaseObject;
  } catch (error) {
    console.error('Error al obtener el álbum:', error);
    throw error;
  }
};
