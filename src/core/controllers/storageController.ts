import { StorageService } from '../services/storageService';

export class StorageController {
  static async upload(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return new Response('Arquivo inválido', { status: 400 });
    }

    try {
      const result = await StorageService.salvarArquivo(file, 'product-images', 'produtos');
      return Response.json(result, { status: 201 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer upload';
      return new Response(message, { status: 500 });
    }
  }
}
