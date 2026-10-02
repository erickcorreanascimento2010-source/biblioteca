// Substitua pelas credenciais reais do seu projeto no painel do Supabase
const SUPABASE_URL = "https://zaoyjylnfdfgnjdsyfvn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pR_SHCLILY7JW2o8XRc0Sw_ofhmj0pa";

// Inicializa o cliente global do Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase conectado com sucesso!");
