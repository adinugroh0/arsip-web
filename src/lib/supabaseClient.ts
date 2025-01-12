import { createClient } from "@supabase/supabase-js";

// Ganti dengan URL dan anon key dari dashboard Supabase Anda
const supabaseUrl = "https://hhgudjkoytojeotqwcgo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZ3VkamtveXRvamVvdHF3Y2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjM1OTEsImV4cCI6MjA1MTk5OTU5MX0.PruNNqzOEKlvYzUpRRBzlm9kXtus85MO5tJNhbdt-Ag";

export const supabase = createClient(supabaseUrl, supabaseKey);
