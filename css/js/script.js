console.log("MenuFlex");
// ====== FUNÇÕES GERAIS ======
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

// ====== PRÉ-VISUALIZAÇÃO DA FOTO ======
document.getElementById('prod_foto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('previewFoto').innerHTML = `<img src="${event.target.result}" class="w-full h-full object-cover rounded-lg" alt="Pré-visualização">`;
    };
    reader.readAsDataURL(file);
});

// ====== SALVAR E CARREGAR DADOS GERAIS ======
function salvarDados() {
    const dados = {
        loja: JSON.parse(localStorage.getItem('dadosLoja')) || {},
        categorias: JSON.parse(localStorage.getItem('categorias')) || [],
        produtos: JSON.parse(localStorage.getItem('produtos')) || []
    };
    localStorage.setItem('dadosLoja', JSON.stringify(dados.loja));
    localStorage.setItem('categorias', JSON.stringify(dados.categorias));
    localStorage.setItem('produtos', JSON.stringify(dados.produtos));
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
    atualizarDashboard();
    atualizarListaCategorias();
    atualizarListaProdutos();
    atualizarSelectCategorias();
    atualizarCardapioPublico();
}

// ====== SALVAR CONFIGURAÇÕES ======
function salvarConfiguracoes() {
    const loja = {
        nome: document.getElementById('conf_nomeLoja').value.trim(),
        whatsapp: document.getElementById('conf_whatsapp').value.trim(),
        horario: document.getElementById('conf_horario').value.trim(),
        pedidoMinimo: document.getElementById('conf_pedidoMinimo').value || '0'
    };
    localStorage.setItem('dadosLoja', JSON.stringify(loja));
    document.getElementById('nomeLojaTopo').textContent = loja.nome || 'Minha Loja';
    mostrarToast('Configurações salvas com sucesso!', 'success');
}

// ====== ATUALIZAR CARDÁPIO PÚBLICO ======
function atualizarCardapioPublico() {
    const loja = JSON.parse(localStorage.getItem('dadosLoja')) || {};
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    document.getElementById('nomeLojaCardapio').textContent = loja.nome || 'Minha Loja';
    document.getElementById('horarioCardapio').textContent = loja.horario || 'Horário não informado';

    let html = '';
    categorias.forEach(cat => {
        const produtosDaCat = produtos.filter(p => p.categoriaId === cat.id && p.disponivel);
        if (produtosDaCat.length === 0) return;

        html += `<h3 class="text-xl font-bold mt-6 mb-3 text-primaryLight border-b border-glassBorder pb-2">${cat.nome}</h3>`;
        html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;

        produtosDaCat.forEach(prod => {
            const imgFoto = prod.foto ? `<img src="${prod.foto}" class="w-full h-full object-cover rounded-lg" alt="${prod.nome}">` : `<img src="imagens/placeholder-produto.png" class="w-full h-full object-cover rounded-lg" alt="Sem foto">`;
            html += `
            <div class="glassmorphism p-4 rounded-xl">
                <div class="img-produto mb-3">${imgFoto}</div>
                <h4 class="font-semibold text-lg mb-2">${prod.nome}</h4>
                <p class="text-gray-300 text-sm mb-3">${prod.descricao || 'Sem descrição'}</p>
                <p class="text-xl font-bold text-accent">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
            </div>`;
        });

        html += `</div>`;
    });

    if (!html) {
        html = `<div class="text-center py-12 text-gray-400">
            <i class="fa fa-cutlery text-5xl mb-4"></i>
            <p class="text-lg">Nenhum produto disponível no cardápio no momento.</p>
        </div>`;
    }

    document.getElementById('conteudoCardapio').innerHTML = html;
}

// ====== ABRIR CARDÁPIO PÚBLICO ======
function abrirCardapio() {
    mostrarAba('cardapioPublico');
}

// ====== ENVIAR CADASTRO PARA WHATSAPP ======
document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault();
    const nomeLoja = document.getElementById('cad_nomeLoja').value.trim();
    const responsavel = document.getElementById('cad_responsavel').value.trim();
    const whatsapp = document.getElementById('cad_whatsapp').value.trim();
    const email = document.getElementById('cad_email').value.trim();
    const senha = document.getElementById('cad_senha').value.trim();

    const dadosLoja = { nome: nomeLoja, whatsapp: whatsapp, email: email, senha: senha };
    localStorage.setItem('dadosLoja', JSON.stringify(dadosLoja));

    const mensagem = `*NOVA LOJA CADASTRADA NO MENUFLEX*%0A%0A🏪 *Nome da Loja:* ${nomeLoja}%0A👤 *Responsável:* ${responsavel}%0A📞 *WhatsApp:* ${whatsapp}%0A📧 *E-mail:* ${email}`;
    const link = `https://wa.me/55${whatsapp.replace(/\D/g, '')}?text=${mensagem}`;
    window.open(link, '_blank');

    mostrarToast('Conta criada com sucesso!', 'success');
    mostrarAba('painel');
    carregarDados();
});

// ====== LOGIN ======
document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login_email').value.trim();
    const senha = document.getElementById('login_senha').value.trim();
    const loja = JSON.parse(localStorage.getItem('dadosLoja')) || {};

    if (loja.email === email && loja.senha === senha) {
        mostrarToast('Login realizado com sucesso!', 'success');
        mostrarAba('painel');
        carregarDados();
    } else {
        mostrarToast('E-mail ou senha incorretos!', 'danger');
    }
});

// ====== SAIR ======
function sairConta() {
    mostrarAba('landing');
    mostrarToast('Desconectado com sucesso!', 'success');
}

// Fechar menu lateral ao clicar fora em telas pequenas
document.addEventListener('click', e => {
    const sidebar = document.getElementById('sidebar');
    const btnAbrir = document.querySelector('button[onclick="abrirSidebar()"]');
    if (window.innerWidth < 768 && sidebar.classList.contains('ativa') && !sidebar.contains(e.target) && e.target !== btnAbrir) {
        fecharSidebar();
    }
});

// Inicialização ao carregar a página
window.addEventListener('load', carregarDados);
