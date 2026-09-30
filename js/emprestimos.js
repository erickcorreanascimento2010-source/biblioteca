// Função para buscar empréstimos trazendo os dados do Aluno e do Livro de uma vez só
async function carregarEmprestimos() {
    const { data, error } = await supabase
        .from('emprestimos')
        .select(`
            id,
            data_emprestimo,
            data_devolucao,
            status,
            alunos ( nome, matricula ),
            livros ( titulo )
        `);

    if (error) {
        console.error("Erro ao buscar empréstimos:", error);
        return;
    }

    exibirEmprestimosNaTabela(data);
}

// Função para renderizar os dados no HTML
function exibirEmprestimosNaTabela(emprestimos) {
    const tabelaCorpo = document.getElementById('corpo-tabela-emprestimos');
    tabelaCorpo.innerHTML = ''; // Limpa a tabela

    emprestimos.forEach(emp => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.alunos.nome} (${emp.alunos.matricula})</td>
            <td>${emp.livros.titulo}</td>
            <td>${new Date(emp.data_emprestimo).toLocaleDateString('pt-BR')}</td>
            <td>${emp.status}</td>
        `;
        tabelaCorpo.appendChild(linha);
    });
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', carregarEmprestimos);
