document.getElementById('formProduto').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('prod_nome').value.trim();
    const descricao = document.getElementById('prod_desc').value.trim();
    const preco = parseFloat(document.getElementById('prod_preco').value);
    const categoriaId = parseInt(document.getElementById('prod_categoria').value);
    const disponivel = document.getElementById('prod_disponivel').checked;
    const fotoInput = document.getElementById('prod_foto');

    if (!nome || !preco || !categoriaId) return;

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const novoProduto = { id: Date.now(), nome, descricao, preco, categoriaId, disponivel, foto: '' };

    if (fotoInput.files && fotoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            novoProduto.foto = evt.target.result;
            finalizarCadastroProduto(produtos, novoProduto);
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        finalizarCadastroProduto(produtos, novoProduto);
    }
});

function finalizarCadastroProduto(lista, produto) {
    lista.push(produto);
    localStorage.setItem('produtos', JSON.stringify(lista));
    fecharModal('modalProduto');
    document.getElementById('formProduto').reset();
    mostrarToast('Produto cadastrado!', 'success');
    atualizarTela();
}

function atualizarListaProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const lista = document.getElementById('listaProdutos');

    if (produtos.length === 0) {
        lista.innerHTML = `<div class="col-span-full text-center py-10 text-gray-400">
            <i class="fa fa-cutlery text-4xl mb-3"></i>
            <p>Nenhum produto cadastrado.</p>
        </div>`;
        return;
    }

    lista.innerHTML = produtos.map(prod => {
        const cat = categorias.find(c => c.id === prod.categoriaId) || { nome: 'Sem categoria' };
        const img = prod.foto ? prod.foto : 'imagens/placeholder-produto.png';
        return `
        <div class="glassmorphism p-4 rounded-xl">
            <div class="img-produto mb-3"><img src="${img}" alt="${prod.nome}" class="w-full h-full object-cover"></div>
            <h4 class="font-semibold text-lg mb-1">${prod.nome}</h4>
            <p class="text-sm text-gray-400 mb-2">${cat.nome}</p>
            <p class="text-xl font-bold text-accent mb-3">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm ${prod.disponivel ? 'text-green-400' : 'text-red-400'}">${prod.disponivel ? 'Disponível' : 'Indisponível'}</span>
                <button onclick="excluirProduto(${prod.id})" class="text-red-400 hover:text-red-300"><i class="fa fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

function filtrarProdutos() {
    const termo = document.getElementById('buscarProduto').value.toLowerCase();
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
    atualizarListaProdutosFiltrados(filtrados);
}

function atualizarListaProdutosFiltrados(listaFiltrada) {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const lista = document.getElementById('listaProdutos');

    if (listaFiltrada.length === 0) {
        lista.innerHTML = `<div class="col-span-full text-center py-10 text-gray-400">
            <p>Nenhum produto encontrado.</p>
        </div>`;
        return;
    }

    lista.innerHTML = listaFiltrada.map(prod => {
        const cat = categorias.find(c => c.id === prod.categoriaId) || { nome: 'Sem categoria' };
        const img = prod.foto ? prod.foto : 'imagens/placeholder-produto.png';
        return `
        <div class="glassmorphism p-4 rounded-xl">
            <div class="img-produto mb-3"><img src="${img}" alt="${prod.nome}" class="w-full h-full object-cover"></div>
            <h4 class="font-semibold text-lg mb-1">${prod.nome}</h4>
            <p class="text-sm text-gray-400 mb-2">${cat.nome}</p>
            <p class="text-xl font-bold text-accent mb-3">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm ${prod.disponivel ? 'text-green-400' : 'text-red-400'}">${prod.disponivel ? 'Disponível' : 'Indisponível'}</span>
                <button onclick="excluirProduto(${prod.id})" class="text-red-400 hover:text-red-300"><i class="fa fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

function excluirProduto(id) {
    if (!confirm('Deseja excluir este produto?')) return;
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const atualizados = produtos.filter(p => p.id !== id);
    localStorage.setItem('produtos', JSON.stringify(atualizados));
    mostrarToast('Produto excluído!', 'success');
    atualizarTela();
}
