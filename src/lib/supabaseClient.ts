import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wmyqymyckqexxxzquqje.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndteXF5bXlja3FleHh4enF1cWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NzE4ODcsImV4cCI6MjA0ODQ0Nzg4N30.ptNDRq1QDVbBz7gr_iYymXLuAyiw_ozlYxWzRmepVsI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
