// Substitua pelas credenciais reais do seu projeto no painel do Supabase
const SUPABASE_URL = "https://zaoyjylnfdfgnjdsyfvn.supabase.co";
const SUPABASE_ANON_KEY = "sua-chave-anon-publica-aqui";

// Inicializa o cliente global do Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase conectado com sucesso!");
