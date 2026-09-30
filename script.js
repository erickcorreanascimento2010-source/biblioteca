// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================

// COLOQUE A URL DO SEU PROJETO AQUI
const SUPABASE_URL = "https://zaoyjylnfdfgnjdsyfvn.supabase.co";

// COLOQUE A SUA PUBLISHABLE KEY / ANON KEY AQUI
const SUPABASE_KEY = "sb_publishable_pR_SHCLILY7JW2o8XRc0Sw_ofhmj0pa";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// FUNÇÃO PARA MOSTRAR ERROS
// ==========================================

function mostrarErro(erro) {
    console.error(erro);

    if (erro?.message) {
        alert("Erro: " + erro.message);
    } else {
        alert("Ocorreu um erro.");
    }
}


// ==========================================
// AUTORES
// ==========================================

async function carregarAutores() {

    const { data, error } = await db
        .from("autores")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        mostrarErro(error);
        return;
    }

    const tabela = document.querySelector("#autores tbody");

    if (!tabela) return;

    tabela.innerHTML = "";

    data.forEach(autor => {

        tabela.innerHTML += `
            <tr>
                <td>${autor.id}</td>
                <td>${autor.nome}</td>
                <td>${autor.nacionalidade || ""}</td>

                <td>
                    <button
                        class="excluir"
                        onclick="excluirAutor(${autor.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}


async function adicionarAutor(nome, nacionalidade) {

    const { error } = await db
        .from("autores")
        .insert({
            nome: nome,
            nacionalidade: nacionalidade
        });

    if (error) {
        mostrarErro(error);
        return;
    }

    alert("Autor cadastrado!");

    carregarAutores();
}


// ==========================================
// CATEGORIAS
// ==========================================

async function carregarCategorias() {

    const { data, error } = await db
        .from("categorias")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        mostrarErro(error);
        return;
    }

    const tabela = document.querySelector("#categorias tbody");

    if (!tabela) return;

    tabela.innerHTML = "";

    data.forEach(categoria => {

        tabela.innerHTML += `
            <tr>
                <td>${categoria.id}</td>
                <td>${categoria.nome}</td>
                <td>${categoria.descricao || ""}</td>

                <td>
                    <button
                        class="excluir"
                        onclick="excluirCategoria(${categoria.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}


async function adicionarCategoria(nome, descricao) {

    const { error } = await db
        .from("categorias")
        .insert({
            nome: nome,
            descricao: descricao
        });

    if (error) {
        mostrarErro(error);
        return;
    }

    alert("Categoria cadastrada!");

    carregarCategorias();
}


// ==========================================
// ALUNOS
// ==========================================

async function carregarAlunos() {

    const { data, error } = await db
        .from("alunos")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        mostrarErro(error);
        return;
    }

    const tabela = document.querySelector("#alunos tbody");

    if (!tabela) return;

    tabela.innerHTML = "";

    data.forEach(aluno => {

        tabela.innerHTML += `
            <tr>
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.matricula}</td>
                <td>${aluno.email || ""}</td>

                <td>
                    <button
                        class="excluir"
                        onclick="excluirAluno(${aluno.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}


async function adicionarAluno(nome, matricula, email) {

    const { error } = await db
        .from("alunos")
        .insert({
            nome: nome,
            matricula: matricula,
            email: email
        });

    if (error) {
        mostrarErro(error);
        return;
    }

    alert("Aluno cadastrado!");

    carregarAlunos();
}


// ==========================================
// LIVROS
// ==========================================

async function carregarLivros() {

    const { data, error } = await db
        .from("livros")
        .select(`
            id,
            titulo,
            ano,
            disponivel,
            autores (
                nome
            ),
            categorias (
                nome
            )
        `)
        .order("id", { ascending: true });

    if (error) {
        mostrarErro(error);
        return;
    }

    const tabela = document.querySelector("#livros tbody");

    if (!tabela) return;

    tabela.innerHTML = "";

    data.forEach(livro => {

        tabela.innerHTML += `
            <tr>
                <td>${livro.id}</td>

                <td>${livro.titulo}</td>

                <td>
                    ${livro.autores?.nome || ""}
                </td>

                <td>
                    ${livro.categorias?.nome || ""}
                </td>

                <td>
                    ${livro.ano || ""}
                </td>

                <td>
                    <button
                        class="excluir"
                        onclick="excluirLivro(${livro.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}


async function adicionarLivro(
    titulo,
    autor_id,
    categoria_id,
    ano
) {

    const { error } = await db
        .from("livros")
        .insert({
            titulo: titulo,
            autor_id: autor_id,
            categoria_id: categoria_id || null,
            ano: ano || null
        });

    if (error) {
        mostrarErro(error);
        return;
    }

    alert("Livro cadastrado!");

    carregarLivros();
}


// ==========================================
// EMPRÉSTIMOS
// ==========================================

async function carregarEmprestimos() {

    const { data, error } = await db
        .from("emprestimos")
        .select(`
            id,
            data_emprestimo,
            data_devolucao,
            devolvido,

            alunos (
                nome
            ),

            livros (
                titulo
            )
        `)
        .order("id", { ascending: true });

    if (error) {
        mostrarErro(error);
        return;
    }

    const tabela = document.querySelector("#emprestimos tbody");

    if (!tabela) return;

    tabela.innerHTML = "";

    data.forEach(emprestimo => {

        let status = emprestimo.devolvido
            ? "Devolvido"
            : "Ativo";

        let classe = emprestimo.devolvido
            ? "ativo"
            : "atrasado";

        tabela.innerHTML += `
            <tr>

                <td>${emprestimo.id}</td>

                <td>
                    ${emprestimo.alunos?.nome || ""}
                </td>

                <td>
                    ${emprestimo.livros?.titulo || ""}
                </td>

                <td>
                    ${emprestimo.data_emprestimo || ""}
                </td>

                <td>
                    ${emprestimo.data_devolucao || ""}
                </td>

                <td>
                    <span class="status ${classe}">
                        ${status}
                    </span>
                </td>

            </tr>
        `;
    });
}


async function adicionarEmprestimo(
    aluno_id,
    livro_id,
    data_emprestimo,
    data_devolucao
) {

    const { error } = await db
        .from("emprestimos")
        .insert({
            aluno_id: aluno_id,
            livro_id: livro_id,
            data_emprestimo: data_emprestimo,
            data_devolucao: data_devolucao,
            devolvido: false
        });

    if (error) {
        mostrarErro(error);
        return;
    }

    // Marca o livro como indisponível
    await db
        .from("livros")
        .update({
            disponivel: false
        })
        .eq("id", livro_id);

    alert("Empréstimo registrado!");

    carregarEmprestimos();
    carregarLivros();
}


// ==========================================
// EXCLUSÕES
// ==========================================

async function excluirAutor(id) {

    if (!confirm("Deseja excluir este autor?")) {
        return;
    }

    const { error } = await db
        .from("autores")
        .delete()
        .eq("id", id);

    if (error) {
        mostrarErro(error);
        return;
    }

    carregarAutores();
    carregarLivros();
}


async function excluirCategoria(id) {

    if (!confirm("Deseja excluir esta categoria?")) {
        return;
    }

    const { error } = await db
        .from("categorias")
        .delete()
        .eq("id", id);

    if (error) {
        mostrarErro(error);
        return;
    }

    carregarCategorias();
    carregarLivros();
}


async function excluirAluno(id) {

    if (!confirm("Deseja excluir este aluno?")) {
        return;
    }

    const { error } = await db
        .from("alunos")
        .delete()
        .eq("id", id);

    if (error) {
        mostrarErro(error);
        return;
    }

    carregarAlunos();
}


async function excluirLivro(id) {

    if (!confirm("Deseja excluir este livro?")) {
        return;
    }

    const { error } = await db
        .from("livros")
        .delete()
        .eq("id", id);

    if (error) {
        mostrarErro(error);
        return;
    }

    carregarLivros();
}


// ==========================================
// CARREGAR TUDO
// ==========================================

async function carregarSistema() {

    await carregarAutores();

    await carregarCategorias();

    await carregarAlunos();

    await carregarLivros();

    await carregarEmprestimos();
}


// ==========================================
// INICIAR SISTEMA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    carregarSistema();

});
