import axios from 'axios';

const GOFILE_API_URL = 'https://api.gofile.io';

export interface GoFileResponse {
  status: string;
  data: any;
}

export class GoFileClientService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  async getServer(): Promise<GoFileResponse> {
    try {
      const response = await axios.get(`${GOFILE_API_URL}/getServer`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener el servidor de GoFile');
    }
  }

  async uploadFile(file: File, folderId?: string): Promise<GoFileResponse> {
    try {
      const serverResponse = await this.getServer();
      const server = serverResponse.data.server;

      const formData = new FormData();
      formData.append('file', file);
      if (folderId) {
        formData.append('folderId', folderId);
      }

      const response = await axios.post(
        `https://${server}.gofile.io/uploadFile`,
        formData,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Error al subir el archivo a GoFile');
    }
  }

  async createFolder(parentFolderId?: string): Promise<GoFileResponse> {
    try {
      const response = await axios.post(
        `${GOFILE_API_URL}/createFolder`,
        {
          parentFolderId,
        },
        {
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al crear la carpeta en GoFile');
    }
  }

  async getContent(folderId: string): Promise<GoFileResponse> {
    try {
      const response = await axios.get(
        `${GOFILE_API_URL}/getContent`,
        {
          params: {
            folderId
          },
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener el contenido de la carpeta');
    }
  }

  async deleteContent(contentId: string): Promise<GoFileResponse> {
    try {
      const response = await axios.delete(
        `${GOFILE_API_URL}/deleteContent`,
        {
          params: {
            contentId
          },
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al eliminar el contenido');
    }
  }
} 