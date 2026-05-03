import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn("Supabase credentials missing. Storage features will not work.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const SupabaseService = {
  client: supabase,

  /**
   * Upload a file to Supabase Storage
   */
  uploadFile: async (bucket: string, path: string, fileBuffer: Buffer, mimeType: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) throw error;
    
    // Get Public URL
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    return { path: data.path, url: publicUrl.publicUrl };
  },

  /**
   * List files in a folder
   */
  listFiles: async (bucket: string, folder: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);
      
    if (error) throw error;
    return data;
  }
};