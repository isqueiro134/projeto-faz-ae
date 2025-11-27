// =========================================================
// 🎯 CONTROLADOR DE SERVIÇOS (CREATE, READ, UPDATE, DELETE)
// =========================================================

// =========================================
// VARIÁVEIS DO DOM
// =========================================
const formServico = document.getElementById('form-servico');
const formContainer = document.getElementById('form-servico-container');
const tabelaServicos = document.querySelector('#tabela-servicos tbody');
const btnNovoServico = document.getElementById('btn-novo-servico');
const formTitulo = document.getElementById('form-titulo');
const servicosVisualizacao = document.getElementById('servicos-visualizacao'); // Onde os cartões são exibidos

// =========================================
// FUNÇÕES DE PERSISTÊNCIA (LOCALSTORAGE)
// =========================================

/**
 * Lê todos os serviços armazenados no localStorage.
 * @returns {Array<Object>} Lista de serviços.
 */
const obterServicos = () => {
    const servicosJSON = localStorage.getItem('servicosFreelancer');
    return servicosJSON ? JSON.parse(servicosJSON) : [];
};

/**
 * Salva a lista completa de serviços no localStorage.
 * @param {Array<Object>} servicos - Lista de serviços a ser salva.
 */
const salvarServicos = (servicos) => {
    localStorage.setItem('servicosFreelancer', JSON.stringify(servicos));
};

// =========================================
// FUNÇÕES DO FORMULÁRIO E AÇÕES
// =========================================

/**
 * Abre o formulário para criação ou edição.
 * @param {Object} [servico=null] - Dados do serviço para pré-preenchimento em modo edição.
 */
const abrirFormulario = (servico = null) => {
    formContainer.style.display = 'block';
    formServico.reset(); // Limpa campos

    if (servico) {
        // Modo Edição
        formTitulo.textContent = 'Editar Serviço';
        document.getElementById('service-id').value = servico.id;
        document.getElementById('titulo').value = servico.titulo;
        document.getElementById('descricao').value = servico.descricao;
        document.getElementById('features').value = servico.features.join(', ');
        document.getElementById('icone-classe').value = servico.iconeClasse;
    } else {
        // Modo Criação
        formTitulo.textContent = 'Criar Novo Serviço';
        document.getElementById('service-id').value = '';
    }
};

/**
 * Fecha e reseta o formulário.
 */
const fecharFormulario = () => {
    formContainer.style.display = 'none';
    formServico.reset();
    document.getElementById('service-id').value = ''; // Garante que o ID é limpo
};

/**
 * Lida com a submissão do formulário para criar ou editar um serviço.
 * @param {Event} e - Evento de submissão.
 */
const handleSubmitServico = (e) => {
    e.preventDefault();

    const id = document.getElementById('service-id').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const featuresStr = document.getElementById('features').value;
    const iconeClasse = document.getElementById('icone-classe').value;

    const novoServico = {
        id: id || Date.now().toString(), // Novo ID se for criação
        titulo,
        descricao,
        features: featuresStr.split(',').map(f => f.trim()).filter(f => f), // Transforma string em array limpo
        iconeClasse
    };

    let servicos = obterServicos();

    if (id) {
        // EDITAR SERVIÇO (UPDATE)
        const index = servicos.findIndex(s => s.id === id);
        if (index > -1) {
            servicos[index] = novoServico;
            console.log(`Serviço ID ${id} editado com sucesso.`);
        }
    } else {
        // CRIAR SERVIÇO (CREATE)
        servicos.push(novoServico);
        console.log(`Novo serviço criado com ID ${novoServico.id}.`);
    }

    salvarServicos(servicos);
    carregarServicos(); // Recarrega a tabela de gerenciamento
    renderizarServicosVisualizacao(); // Recarrega a seção de visualização
    fecharFormulario();
};

/**
 * Pré-preenche o formulário com os dados do serviço para edição.
 * @param {string} id - ID do serviço a ser editado.
 */
const editarServico = (id) => {
    const servicos = obterServicos();
    const servico = servicos.find(s => s.id === id);

    if (servico) {
        abrirFormulario(servico);
        formContainer.scrollIntoView({ behavior: 'smooth' }); 
    } else {
        alert('Serviço não encontrado!');
    }
};

/**
 * Remove um serviço da lista.
 * @param {string} id - ID do serviço a ser excluído.
 */
const excluirServico = (id) => {
    if (!confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
        return;
    }

    let servicos = obterServicos();
    const servicosAtualizados = servicos.filter(s => s.id !== id);

    salvarServicos(servicosAtualizados);
    console.log(`Serviço ID ${id} excluído.`);
    carregarServicos(); // Recarrega a tabela de gerenciamento
    renderizarServicosVisualizacao(); // Recarrega a seção de visualização
};

// =========================================
// FUNÇÕES DE RENDERIZAÇÃO (READ)
// =========================================

/**
 * Renderiza um serviço como uma linha na tabela de gerenciamento (Painel CRUD).
 */
const criarLinhaTabela = (servico) => {
    return `
        <tr>
            <td><i class="${servico.iconeClasse}" style="color: #70F8F8; margin-right: 10px;"></i> ${servico.titulo}</td>
            <td>
                <button class="btn-acao" onclick="editarServico('${servico.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-acao btn-excluir" onclick="excluirServico('${servico.id}')">
                    <i class="fas fa-trash-alt"></i> Excluir
                </button>
            </td>
        </tr>
    `;
};

/**
 * Carrega todos os serviços do localStorage e atualiza a tabela de gerenciamento.
 */
const carregarServicos = () => {
    const servicos = obterServicos();
    
    // Limpa a tabela
    tabelaServicos.innerHTML = ''; 

    if (servicos.length === 0) {
        tabelaServicos.innerHTML = '<tr><td colspan="2" style="text-align: center; color: #bdbdbd;">Nenhum serviço cadastrado.</td></tr>';
        return;
    }

    // Preenche a tabela
    servicos.forEach(servico => {
        tabelaServicos.innerHTML += criarLinhaTabela(servico);
    });
};

/**
 * Renderiza um serviço como um card para a seção de visualização (#servicos).
 */
const criarCardServico = (servico) => {
    const featuresList = servico.features.map(f => `<li>${f}</li>`).join('');

    return `
        <div class="service-item card">
            <div class="service-icon">
                <i class="${servico.iconeClasse}"></i>
            </div>
            <h3>${servico.titulo}</h3>
            <p>${servico.descricao}</p>
            <ul class="key-features">
                ${featuresList}
            </ul>
            <a href="#contato" class="home-bts">Solicitar Orçamento</a>
        </div>
    `;
};

/**
 * Carrega todos os serviços e os renderiza na seção de visualização (#servicos).
 */
const renderizarServicosVisualizacao = () => {
    const servicos = obterServicos();
    
    servicosVisualizacao.innerHTML = '';

    if (servicos.length === 0) {
        servicosVisualizacao.innerHTML = `<p style="text-align: center; color: #bdbdbd;">
            Você ainda não tem serviços cadastrados. Use o painel de gerenciamento abaixo para adicionar o primeiro!
        </p>`;
        // Remove a classe grid se estiver vazia
        servicosVisualizacao.classList.remove('services-grid'); 
        return;
    }

    servicosVisualizacao.classList.add('services-grid'); 
    servicos.forEach(servico => {
        servicosVisualizacao.innerHTML += criarCardServico(servico);
    });
};

// =========================================
// LISTENERS DE EVENTOS E INICIALIZAÇÃO
// =========================================

const inicializarListenersServicos = () => {
    // 1. Lógica do seu colega (NÃO EXCLUÍDA)
    const botaoHamburguer = document.querySelector('.menu-hamburguer');
    const menuNavegacao = document.querySelector('.menu-navegacao');
  
    if (botaoHamburguer && menuNavegacao) {
        botaoHamburguer.addEventListener('click', () => {
          // Alterna a classe 'ativo' no botão e no menu
          botaoHamburguer.classList.toggle('ativo');
          menuNavegacao.classList.toggle('ativo');
      
          // Atualiza o atributo aria-expanded para acessibilidade
          const estaExpandido = botaoHamburguer.classList.contains('ativo');
          botaoHamburguer.setAttribute('aria-expanded', estaExpandido);
        });
    }

    // 2. Lógica do CRUD
    btnNovoServico.addEventListener('click', () => abrirFormulario(null));
    formServico.addEventListener('submit', handleSubmitServico);
    
    // Torna as funções de CRUD globais para serem usadas nos onclicks da tabela
    window.editarServico = editarServico;
    window.excluirServico = excluirServico;
    window.fecharFormulario = fecharFormulario;
    
    // Inicia o carregamento dos dados
    carregarServicos();
    renderizarServicosVisualizacao();
};

/**
 * Função de inicialização principal
 */
document.addEventListener('DOMContentLoaded', inicializarListenersServicos);