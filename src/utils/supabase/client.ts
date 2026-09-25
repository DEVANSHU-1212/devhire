import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://amvtjdhyonplwgkmcmxf.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_Ynu9OE7wF-hNWJgsle9rsQ_r2NinInK";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
