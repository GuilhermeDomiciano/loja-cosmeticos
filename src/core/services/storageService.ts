import { StorageAdapter } from "../adapters/storageAdapter";


export class StorageService {
  static async salvarArquivo(
    file: File | Blob,
    bucket = 'product-images',
    pasta = 'uploads'
  ) {
    const path = await StorageAdapter.upload(bucket, file, pasta);
    const url = await StorageAdapter.getPublicUrl(bucket, path);

    return { path, url };
  }
}
