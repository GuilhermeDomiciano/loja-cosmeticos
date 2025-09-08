import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export class StorageAdapter {
  static async upload(bucket: string, file: File | Blob, folder = '') {
    const filename = `${folder ? folder + '/' : ''}${randomUUID()}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw new Error(error.message);

    return data?.path!;
  }

  static async getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
