import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://enhrzfojtmjbwpywwtvx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaHJ6Zm9qdG1qYndweXd3dHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA2MDYwNTUsImV4cCI6MjAwNjE4MjA1NX0.a-DMFPZTmDGodZbqWeeGPH8wGxD103Fpuz8LqMCNuw0"
);