// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================
const SUPABASE_URL = "https://zaoyjylnfdfgnjdsyfvn.supabase.co";
const SUPABASE_KEY = "sb_publishable_pR_SHCLILY7JW2o8XRc0Sw_ofhmj0pa";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================
function mostrarErro(erro) {
    console.error(erro);
    alert("Erro: " + (erro?.message || "Ocorreu um erro no sistema."));
}

function escapar(valor) {
    const div = document.createElement("div");
    div.textContent = valor ?? "";
    return div.innerHTML;
}

function formatarData(data) {
    if (!data) return "";
    return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

function preencherSelect(id, dados, texto, valor = "id") {
    const select = document.getElementById(id);
    if (!select) return;
    const primeiraOpcao = select.options[0]?.textContent || "Selecione";
    select.innerHTML = `<option value="">${primeiraOpcao}</option>`;
    dados.forEach(item => {
        select.innerHTML += `<option value="${item[valor]}">${escapar(item[texto])}</option>`;
    });
}

// ==========================================
// AUTORES
// ==========================================
async function carregarAutores() {
    const { data, error } = await db.from("autores").select("*").order("id");
    if (error) return mostrarErro(error);

    const tabela = document.getElementById("tabela-autores");
    tabela.innerHTML = data.map(autor => `
        <tr>
            <td>${autor.id}</td>
            <td>${escapar(autor.nome)}</td>
            <td>${escapar(autor.nacionalidade)}</td>
            <td><button class="excluir" onclick="excluirAutor(${autor.id})">Excluir</button></td>
        </tr>
    `).join("");

    preencherSelect("livro-autor", data, "nome");
}

async function excluirAutor(id) {
    if (!confirm("Deseja excluir este autor?")) return;
    const { error } = await db.from("autores").delete().eq("id", id);
    if (error) return mostrarErro(error);
    await carregarAutores();
    await carregarLivros();
}

// ==========================================
// CATEGORIAS
// ==========================================
async function carregarCategorias() {
    const { data, error } = await db.from("categorias").select("*").order("id");
    if (error) return mostrarErro(error);

    const tabela = document.getElementById("tabela-categorias");
    tabela.innerHTML = data.map(categoria => `
        <tr>
            <td>${categoria.id}</td>
            <td>${escapar(categoria.nome)}</td>
            <td>${escapar(categoria.descricao)}</td>
            <td><button class="excluir" onclick="excluirCategoria(${categoria.id})">Excluir</button></td>
        </tr>
    `).join("");

    preencherSelect("livro-categoria", data, "nome");
}

async function excluirCategoria(id) {
    if (!confirm("Deseja excluir esta categoria?")) return;
    const { error } = await db.from("categorias").delete().eq("id", id);
    if (error) return mostrarErro(error);
    await carregarCategorias();
    await carregarLivros();
}

// ==========================================
// ALUNOS
// ==========================================
async function carregarAlunos() {
    const { data, error } = await db.from("alunos").select("*").order("id");
    if (error) return mostrarErro(error);

    const tabela = document.getElementById("tabela-alunos");
    tabela.innerHTML = data.map(aluno => `
        <tr>
            <td>${aluno.id}</td>
            <td>${escapar(aluno.nome)}</td>
            <td>${escapar(aluno.matricula)}</td>
            <td>${escapar(aluno.email)}</td>
            <td><button class="excluir" onclick="excluirAluno(${aluno.id})">Excluir</button></td>
        </tr>
    `).join("");

    preencherSelect("emprestimo-aluno", data, "nome");
}

async function excluirAluno(id) {
    if (!confirm("Deseja excluir este aluno?")) return;
    const { error } = await db.from("alunos").delete().eq("id", id);
    if (error) return mostrarErro(error);
    await carregarAlunos();
}

// ==========================================
// LIVROS
// ==========================================
async function carregarLivros() {
    const { data, error } = await db
        .from("livros")
        .select(`id, titulo, ano, disponivel, autor_id, categoria_id, autores(nome), categorias(nome)`)
        .order("id");

    if (error) return mostrarErro(error);

    const tabela = document.getElementById("tabela-livros");
    tabela.innerHTML = data.map(livro => `
        <tr>
            <td>${livro.id}</td>
            <td>${escapar(livro.titulo)}</td>
            <td>${escapar(livro.autores?.nome)}</td>
            <td>${escapar(livro.categorias?.nome)}</td>
            <td>${livro.ano ?? ""}</td>
            <td><span class="status ${livro.disponivel === false ? "atrasado" : "ativo"}">
                ${livro.disponivel === false ? "Emprestado" : "Disponível"}
            </span></td>
            <td><button class="excluir" onclick="excluirLivro(${livro.id})">Excluir</button></td>
        </tr>
    `).join("");

    const disponiveis = data.filter(livro => livro.disponivel !== false);
    preencherSelect("emprestimo-livro", disponiveis, "titulo");
}

async function excluirLivro(id) {
    if (!confirm("Deseja excluir este livro?")) return;
    const { error } = await db.from("livros").delete().eq("id", id);
    if (error) return mostrarErro(error);
    await carregarLivros();
}

// ==========================================
// EMPRÉSTIMOS
// ==========================================
async function carregarEmprestimos() {
    const { data, error } = await db
        .from("emprestimos")
        .select(`id, data_emprestimo, data_devolucao, devolvido, aluno_id, livro_id, alunos(nome), livros(titulo)`)
        .order("id");

    if (error) return mostrarErro(error);

    const hoje = new Date().toISOString().split("T")[0];
    const tabela = document.getElementById("tabela-emprestimos");

    tabela.innerHTML = data.map(emp => {
        let status = "Ativo";
        let classe = "ativo";
        if (emp.devolvido) {
            status = "Devolvido";
        } else if (emp.data_devolucao && emp.data_devolucao < hoje) {
            status = "Atrasado";
            classe = "atrasado";
        }

        return `
            <tr>
                <td>${emp.id}</td>
                <td>${escapar(emp.alunos?.nome)}</td>
                <td>${escapar(emp.livros?.titulo)}</td>
                <td>${formatarData(emp.data_emprestimo)}</td>
                <td>${formatarData(emp.data_devolucao)}</td>
                <td><span class="status ${classe}">${status}</span></td>
                <td>${emp.devolvido ? "—" : `<button class="editar" onclick="devolverLivro(${emp.id}, ${emp.livro_id})">Devolver</button>`}</td>
            </tr>
        `;
    }).join("");
}

async function devolverLivro(emprestimoId, livroId) {
    if (!confirm("Confirmar devolução deste livro?")) return;

    const { error: erroEmprestimo } = await db
        .from("emprestimos")
        .update({ devolvido: true })
        .eq("id", emprestimoId);

    if (erroEmprestimo) return mostrarErro(erroEmprestimo);

    const { error: erroLivro } = await db
        .from("livros")
        .update({ disponivel: true })
        .eq("id", livroId);

    if (erroLivro) return mostrarErro(erroLivro);

    await carregarEmprestimos();
    await carregarLivros();
}

// ==========================================
// FORMULÁRIOS
// ==========================================
document.getElementById("form-autor").addEventListener("submit", async e => {
    e.preventDefault();
    const nome = document.getElementById("autor-nome").value.trim();
    const nacionalidade = document.getElementById("autor-nacionalidade").value.trim();

    const { error } = await db.from("autores").insert({ nome, nacionalidade });
    if (error) return mostrarErro(error);

    e.target.reset();
    await carregarAutores();
    alert("Autor cadastrado com sucesso!");
});

document.getElementById("form-categoria").addEventListener("submit", async e => {
    e.preventDefault();
    const nome = document.getElementById("categoria-nome").value.trim();
    const descricao = document.getElementById("categoria-descricao").value.trim();

    const { error } = await db.from("categorias").insert({ nome, descricao });
    if (error) return mostrarErro(error);

    e.target.reset();
    await carregarCategorias();
    alert("Categoria cadastrada com sucesso!");
});

document.getElementById("form-aluno").addEventListener("submit", async e => {
    e.preventDefault();
    const nome = document.getElementById("aluno-nome").value.trim();
    const matricula = document.getElementById("aluno-matricula").value.trim();
    const email = document.getElementById("aluno-email").value.trim();

    const { error } = await db.from("alunos").insert({ nome, matricula, email });
    if (error) return mostrarErro(error);

    e.target.reset();
    await carregarAlunos();
    alert("Aluno cadastrado com sucesso!");
});

document.getElementById("form-livro").addEventListener("submit", async e => {
    e.preventDefault();
    const titulo = document.getElementById("livro-titulo").value.trim();
    const autor_id = Number(document.getElementById("livro-autor").value);
    const categoriaValor = document.getElementById("livro-categoria").value;
    const anoValor = document.getElementById("livro-ano").value;

    const { error } = await db.from("livros").insert({
        titulo,
        autor_id,
        categoria_id: categoriaValor ? Number(categoriaValor) : null,
        ano: anoValor ? Number(anoValor) : null,
        disponivel: true
    });

    if (error) return mostrarErro(error);

    e.target.reset();
    await carregarLivros();
    alert("Livro cadastrado com sucesso!");
});

document.getElementById("form-emprestimo").addEventListener("submit", async e => {
    e.preventDefault();
    const aluno_id = Number(document.getElementById("emprestimo-aluno").value);
    const livro_id = Number(document.getElementById("emprestimo-livro").value);
    const data_emprestimo = document.getElementById("emprestimo-data").value;
    const data_devolucao = document.getElementById("emprestimo-devolucao").value;

    if (data_devolucao < data_emprestimo) {
        alert("A data de devolução não pode ser anterior à data do empréstimo.");
        return;
    }

    const { error } = await db.from("emprestimos").insert({
        aluno_id,
        livro_id,
        data_emprestimo,
        data_devolucao,
        devolvido: false
    });

    if (error) return mostrarErro(error);

    const { error: erroLivro } = await db.from("livros").update({ disponivel: false }).eq("id", livro_id);
    if (erroLivro) return mostrarErro(erroLivro);

    e.target.reset();
    document.getElementById("emprestimo-data").value = new Date().toISOString().split("T")[0];
    await carregarEmprestimos();
    await carregarLivros();
    alert("Empréstimo registrado com sucesso!");
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================
async function carregarSistema() {
    try {
        await carregarAutores();
        await carregarCategorias();
        await carregarAlunos();
        await carregarLivros();
        await carregarEmprestimos();

        document.getElementById("emprestimo-data").value = new Date().toISOString().split("T")[0];
    } catch (erro) {
        mostrarErro(erro);
    }
}

document.addEventListener("DOMContentLoaded", carregarSistema);
