// ======================
// FUNÇÕES GERAIS
// ======================
function mostrarAba(id) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.getElementById(id).classList.add('ativa');
    window.scrollTo(0, 0);
}

function mostrarSecao(id, botao) {
    document.querySelectorAll('.secao').forEach(sec => sec.classList.remove('ativa'));
    document.getElementById(id).classList.add('ativa');
    document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('menu-ativo'));
    if (botao) botao.classList.add('menu-ativo');
}

function abrirMenuMobile() { document.getElementById('menuMobile').style.display = 'flex'; }
function fecharMenuMobile() { document.getElementById('menuMobile').style.display = 'none'; }
function abrirSidebar() { document.getElementById('sidebar').classList.add('ativa'); }
function fecharSidebar() { document.getElementById('sidebar').classList.remove('ativa'); }

function abrirModal(id) { document.getElementById(id).classList.add('ativa'); }
function fecharModal(id) {
    document.getElementById(id).classList.remove('ativa');
    document.getElementById('previewFoto').innerHTML = '<i class="fa fa-image text-3xl text-gray-500"></i>';
    document.getElementById('prod_foto').value = '';
}

function mostrarToast(mensagem, tipo = 'info') {
    const t = document.getElementById('toast');
    t.textContent = mensagem;
    t.className = `toast ativa ${tipo}`;
    setTimeout(() => t.classList.remove('ativa'), 3000);
}

// Pré-visualização da foto
document.getElementById('prod_foto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        document.getElementById('previewFoto').innerHTML = `<img src="${evt.target.result}" class="w-full h-full object-cover rounded-lg" alt="Foto">`;
    };
    reader.readAsDataURL(file);
});

// ======================
// GERENCIAMENTO DE DADOS
// ======================
function salvarDados() {
    const dados = {
        loja: JSON.parse(localStorage.getItem('dadosLoja')) || {},
        categorias: JSON.parse(localStorage.getItem('categorias')) || [],
        produtos: JSON.parse(localStorage.getItem('produtos')) || [],
        pedidos: JSON.parse(localStorage.getItem('pedidos')) || []
    };
    localStorage.setItem('dadosLoja', JSON.stringify(dados.loja));
    localStorage.setItem('categorias', JSON.stringify(dados.categorias));
    localStorage.setItem('produtos', JSON.stringify(dados.produtos));
    localStorage.setItem('pedidos', JSON.stringify(dados.pedidos));
    atualizarTela();
}

function carregarDados() {
    const loja = JSON.parse(localStorage.getItem('dadosLoja')) || {};
    document.getElementById('nomeLojaTopo').textContent = loja.nome || 'Minha Loja';
    document.getElementById('conf_nomeLoja').value = loja.nome || '';
    document.getElementById('conf_whatsapp').value = loja.whatsapp || '';
    document.getElementById('conf_horario').value = loja.horario || '';
    document.getElementById('conf_pedidoMinimo').value = loja.pedidoMinimo || '';
    atualizarTela();
}

function atualizarTela() {
    if (typeof atualizarDashboard === 'function') atualizarDashboard();
    if (typeof atualizarListaCategorias === 'function') atualizarListaCategorias();
    if (typeof atualizarListaProdutos === 'function') atualizarListaProdutos();
    if (typeof atualizarSelectCategorias === 'function') atualizarSelectCategorias();
    if (typeof atualizarListaPedidos === 'function') atualizarListaPedidos();
    if (typeof atualizarCardapioPublico === 'function') atualizarCardapioPublico();
}

// Salvar configurações
function salvarConfiguracoes() {
    const loja = {
        nome: document.getElementById('conf_nomeLoja').value.trim(),
        whatsapp: document.getElementById('conf_whatsapp').value.trim(),
        horario: document.getElementById('conf_horario').value.trim(),
        pedidoMinimo: document.getElementById('conf_pedidoMinimo').value || '0'
    };
    localStorage.setItem('dadosLoja', JSON.stringify(loja));
    document.getElementById('nomeLojaTopo').textContent = loja.nome || 'Minha Loja';
    mostrarToast('Configurações salvas!', 'success');
}

// Abrir cardápio público
function abrirCardapio() {
    window.open('loja/cardapio.html', '_blank');
}

// Cadastro
document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault();
    const dadosLoja = {
        nome: document.getElementById('cad_nomeLoja').value.trim(),
        responsavel: document.getElementById('cad_responsavel').value.trim(),
        whatsapp: document.getElementById('cad_whatsapp').value.trim(),
        email: document.getElementById('cad_email').value.trim(),
        senha: document.getElementById('cad_senha').value.trim()
    };
    localStorage.setItem('dadosLoja', JSON.stringify(dadosLoja));
    mostrarToast('Conta criada com sucesso!', 'success');
    mostrarAba('painel');
    carregarDados();
});

// Login
document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login_email').value.trim();
    const senha = document.getElementById('login_senha').value.trim();
    const loja = JSON.parse(localStorage.getItem('dadosLoja')) || {};
    if (loja.email === email && loja.senha === senha) {
        mostrarToast('Login realizado!', 'success');
        mostrarAba('painel');
        carregarDados();
    } else {
        mostrarToast('E-mail ou senha incorretos!', 'danger');
    }
});

// Sair
function sairConta() {
    mostrarAba('landing');
    mostrarToast('Desconectado!', 'success');
}

// Fechar menu lateral ao clicar fora
document.addEventListener('click', e => {
    const sidebar = document.getElementById('sidebar');
    const btnAbrir = document.querySelector('button[onclick="abrirSidebar()"]');
    if (window.innerWidth < 768 && sidebar.classList.contains('ativa') && !sidebar.contains(e.target) && e.target !== btnAbrir) {
        fecharSidebar();
    }
});

// Inicializar sistema
window.addEventListener('load', carregarDados);
