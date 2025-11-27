// =========================================================
// 🎯 CONTROLADOR PRINCIPAL (MENU HAMBÚRGUER + CRUD)
// =========================================================

// =========================================
// 1. LÓGICA DO MENU HAMBÚRGUER
// =========================================
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Inicia o carregamento de todos os dados APÓS a inicialização do menu
    inicializarListenersServicos();
});


// =========================================
// 2. LÓGICA DO CRUD DE SERVIÇOS
// =========================================

// VARIÁVEIS DO DOM
const formServico = document.getElementById('form-servico');
const formContainer = document.getElementById('form-servico-container');
const tabelaServicos = document.querySelector('#tabela-servicos tbody');
const btnNovoServico = document.getElementById('btn-novo-servico');
const formTitulo = document.getElementById('form-titulo');
const servicosVisualizacao = document.getElementById('servicos-visualizacao'); 

// FUNÇÕES DE PERSISTÊNCIA (LOCALSTORAGE)
const obterServicos = () => {
    const servicosJSON = localStorage.getItem('servicosFreelancer');
    return servicosJSON ? JSON.parse(servicosJSON) : [];
};

const salvarServicos = (servicos) => {
    localStorage.setItem('servicosFreelancer', JSON.stringify(servicos));
};

// FUNÇÕES DO FORMULÁRIO E AÇÕES
const abrirFormulario = (servico = null) => {
    formContainer.style.display = 'block';
    formServico.reset(); 

    if (servico) {
        formTitulo.textContent = 'Editar Serviço';
        document.getElementById('service-id').value = servico.id;
        document.getElementById('titulo').value = servico.titulo;
        document.getElementById('descricao').value = servico.descricao;
        document.getElementById('features').value = servico.features.join(', ');
        document.getElementById('icone-classe').value = servico.iconeClasse;
    } else {
        formTitulo.textContent = 'Criar Novo Serviço';
        document.getElementById('service-id').value = '';
    }
};

const fecharFormulario = () => {
    formContainer.style.display = 'none';
    formServico.reset();
    document.getElementById('service-id').value = '';
};

const handleSubmitServico = (e) => {
    e.preventDefault();

    const id = document.getElementById('service-id').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const featuresStr = document.getElementById('features').value;
    const iconeClasse = document.getElementById('icone-classe').value;

    const novoServico = {
        id: id || Date.now().toString(), 
        titulo,
        descricao,
        features: featuresStr.split(',').map(f => f.trim()).filter(f => f),
        iconeClasse
    };

    let servicos = obterServicos();

    if (id) {
        const index = servicos.findIndex(s => s.id === id);
        if (index > -1) {
            servicos[index] = novoServico;
        }
    } else {
        servicos.push(novoServico);
    }

    salvarServicos(servicos);
    carregarServicos();
    renderizarServicosVisualizacao();
    fecharFormulario();
};

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

const excluirServico = (id) => {
    if (!confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
        return;
    }

    let servicos = obterServicos();
    const servicosAtualizados = servicos.filter(s => s.id !== id);

    salvarServicos(servicosAtualizados);
    carregarServicos();
    renderizarServicosVisualizacao();
};

// FUNÇÕES DE RENDERIZAÇÃO (READ)
const criarLinhaTabela = (servico) => {
    return `
        <tr>
            <td><i class="${servico.iconeClasse}" style="color: #4A00E0; margin-right: 10px;"></i> ${servico.titulo}</td>
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

const carregarServicos = () => {
    const servicos = obterServicos();
    tabelaServicos.innerHTML = ''; 

    if (servicos.length === 0) {
        tabelaServicos.innerHTML = '<tr><td colspan="2" style="text-align: center; color: #bdbdbd;">Nenhum serviço cadastrado.</td></tr>';
        return;
    }

    servicos.forEach(servico => {
        tabelaServicos.innerHTML += criarLinhaTabela(servico);
    });
};

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

const renderizarServicosVisualizacao = () => {
    const servicos = obterServicos();
    
    servicosVisualizacao.innerHTML = '';

    if (servicos.length === 0) {
        servicosVisualizacao.innerHTML = `<p style="text-align: center; color: #333;">
            Você ainda não tem serviços cadastrados. Use o painel de gerenciamento abaixo para adicionar o primeiro!
        </p>`;
        servicosVisualizacao.classList.remove('services-grid'); 
        return;
    }

    servicosVisualizacao.classList.add('services-grid'); 
    servicos.forEach(servico => {
        servicosVisualizacao.innerHTML += criarCardServico(servico);
    });
};

// LISTENERS DE EVENTOS E INICIALIZAÇÃO
const inicializarListenersServicos = () => {
    btnNovoServico.addEventListener('click', () => abrirFormulario(null));
    formServico.addEventListener('submit', handleSubmitServico);
    
    // Torna as funções de CRUD globais para serem usadas nos onclicks da tabela e no botão Cancelar
    window.editarServico = editarServico;
    window.excluirServico = excluirServico;
    window.fecharFormulario = fecharFormulario;
    
    // Inicia o carregamento dos dados
    carregarServicos();
    renderizarServicosVisualizacao();
};