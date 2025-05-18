import { NextRequest, NextResponse } from 'next/server';

import { GoFileServerService } from '@/lib/gofile-server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderId = formData.get('folderId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    const goFile = new GoFileServerService(process.env.GOFILE_API_KEY || '');

    // Convertir el archivo a Buffer para el servidor
    const buffer = Buffer.from(await file.arrayBuffer());

    // Aquí necesitarías implementar la lógica para subir el archivo usando el buffer
    // ya que la API de GoFile requiere un archivo real del sistema de archivos
    // o una implementación específica para manejar buffers

    return NextResponse.json({ message: 'Archivo recibido' });
  } catch (error) {
    console.error('Error al procesar la subida:', error);
    return NextResponse.json({ error: 'Error al procesar la subida del archivo' }, { status: 500 });
  }
}
