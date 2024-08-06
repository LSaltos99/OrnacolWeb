// supabaseConfig.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mkhwyyzdqssijcrnlkhe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raHd5eXpkcXNzaWpjcm5sa2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMTU5NTksImV4cCI6MjAyMjg5MTk1OX0.m__T6atTnr8BQt6wc0RQDYEDiDoW1HvLyNOCn4YOuRs';
const supabaseSecretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raHd5eXpkcXNzaWpjcm5sa2hlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzMxNTk1OSwiZXhwIjoyMDIyODkxOTU5fQ.EwRl0DRqcf52drK06Ld8XhMelZF1iwqDbkXwEplvmMU';

// Inicializar el cliente de Supabase
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseSecret = createClient(supabaseUrl, supabaseSecretKey);
