import { GoFileService } from './gofile';

// Ejemplo de uso
async function example() {
  // Inicializar el servicio con tu API key
  const goFile = new GoFileService(process.env.GOFILE_API_KEY || '');

  try {
    // Crear una carpeta
    const folderResponse = await goFile.createFolder();
    const folderId = folderResponse.data.id;

    // Subir un archivo a la carpeta creada
    const file = new File(['contenido del archivo'], 'archivo.txt');
    const uploadResponse = await goFile.uploadFile(file, folderId);
    console.log('Archivo subido:', uploadResponse.data);

    // Obtener el contenido de la carpeta
    const contentResponse = await goFile.getContent(folderId);
    console.log('Contenido de la carpeta:', contentResponse.data);

    // Eliminar un archivo
    const fileId = uploadResponse.data.fileId;
    const deleteResponse = await goFile.deleteContent(fileId);
    console.log('Archivo eliminado:', deleteResponse.data);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar el ejemplo
example(); 