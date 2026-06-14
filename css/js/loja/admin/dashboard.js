console.log("Dashboard");
function atualizarDashboard() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    document.getElementById('qtdProdutos').textContent = produtos.length;
    document.getElementById('qtdCategorias').textContent = categorias.length;

    // Contagem de pedidos de hoje
    const hoje = new Date().toISOString().split('T')[0];
    const pedidosHoje = pedidos.filter(p => p.data?.startsWith(hoje));
    document.getElementById('qtdPedidosHoje').textContent = pedidosHoje.length;

    const faturamento = pedidosHoje.reduce((total, p) => total + (p.valorTotal || 0), 0);
    document.getElementById('valorFaturamentoHoje').textContent = `R$ ${faturamento.toFixed(2).replace('.', ',')}`;
}
