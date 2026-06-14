document.getElementById('formCategoria').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('cat_nome').value.trim();
    if (!nome) return;

    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const novaCategoria = { id: Date.now(), nome: nome };
    categorias.push(novaCategoria);

    localStorage.setItem('categorias', JSON.stringify(categorias));
    fecharModal('modalCategoria');
    document.getElementById('cat_nome').value = '';
    mostrarToast('Categoria cadastrada!', 'success');
    atualizarTela();
});

function atualizarListaCategorias() {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const lista = document.getElementById('listaCategorias');

    if (categorias.length === 0) {
        lista.innerHTML = `<div class="text-center py-10 text-gray-400">
            <i class="fa fa-th-large text-4xl mb-3"></i>
            <p>Nenhuma categoria cadastrada.</p>
        </div>`;
        return;
    }

    lista.innerHTML = categorias.map(cat => `
        <div class="glassmorphism p-4 rounded-lg flex justify-between items-center">
            <span>${cat.nome}</span>
            <div class="flex gap-2">
                <button onclick="excluirCategoria(${cat.id})" class="text-red-400 hover:text-red-300"><i class="fa fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function atualizarSelectCategorias() {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const select = document.getElementById('prod_categoria');
    select.innerHTML = `<option value="">Selecione uma categoria</option>`;
    categorias.forEach(cat => select.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`);
}

function excluirCategoria(id) {
    if (!confirm('Deseja excluir esta categoria?')) return;
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const atualizadas = categorias.filter(cat => cat.id !== id);
    localStorage.setItem('categorias', JSON.stringify(atualizadas));
    mostrarToast('Categoria excluída!', 'success');
    atualizarTela();
}
admin/categorias.js
