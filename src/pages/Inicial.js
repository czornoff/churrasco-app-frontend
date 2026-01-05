import React from 'react';

export default function Inicial({ dados, styles }) {
    // Se o App.js ainda está carregando o conteúdo do banco
    if (!dados) return <div style={styles.container}>Carregando...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{dados.manualUsoTitulo || '🔥 Como funciona nossa Calculadora'}</h1>
            </header>

            <div style={styles.contentWrapper}>
                {/* Renderiza o HTML do TinyMCE que veio do banco */}
                <div 
                    className="html-content"
                    style={styles.cardText}
                    dangerouslySetInnerHTML={{ __html: dados.manualUsoTexto || '<p>Bem-vindo à forma mais inteligente de organizar o seu evento! Este guia ajudará você a navegar pelas funcionalidades do aplicativo para garantir que não falte nada (e nem sobre demais) no seu próximo churrasco.</p><h3>1. Configurando os Participantes</h3><p>O primeiro passo é informar quem estará no evento. O cálculo é personalizado por perfil de consumo:</p><dl><dd>🧔 <b>Homens</b>: Base de consumo maior para carnes e acompanhamentos.</dd><dd>👩 <b>Mulheres</b>: Base de consumo moderada.</dd><dd>👶 <b>Crianças</b>: Consumo reduzido (geralmente metade de um adulto).</dd><dd>🍺 <b>Bebem Álcool</b>: Informe quantos dos adultos (homens + mulheres) consomem bebidas alcoólicas. Isso ajustará a quantidade de cerveja/chopp sem interferir no cálculo de refrigerantes e sucos.</dd><dd>⏱️ <b>Horas</b>: Informe a duração do evento. Churrascos mais longos exigem uma margem maior de comida e bebida gelada.</dd></dl><h3>2. Seleção de Itens</h3><p>Navegue pelas categorias e selecione apenas o que deseja comprar. O sistema distribuirá a quantidade total necessária entre os itens marcados.</p><dl><dd><b>Carnes</b> (Bovina, Suína, Frango, Linguiça): Você pode selecionar vários cortes. Se selecionar 3 tipos de carne bovina, o sistema dividirá o peso total entre elas.</dd><dd><b>Bebidas</b>: Escolha entre opções alcoólicas e não alcoólicas.</dd><dd><b>Adicionais e Acompanhamentos</b>: Itens essenciais como pão de alho, queijo coalho, arroz e farofa.</dd><dd><b>Utensílios</b>: Marque se precisará de carvão, pratos e talheres descartáveis.</dd></dl><h3>3. Gerando a Lista de Compras</h3><p>Após configurar tudo, clique no botão <b>📑 GERAR LISTA DE COMPRAS</b>.</p><p>Uma janela (modal) aparecerá com o resumo detalhado:</p><dl><dd><b>Quantidades </b>Exatas: Ex: "2.5kg de Picanha", "12 latas de Cerveja".</dd><dd><b>Observações de Litragem</b>: O sistema informa o total de litros de bebidas para ajudar na compra de garrafas grandes ou latas.</dd><dd><b>Sugestões de Consumo</b>: Dicas sobre o total estimado por categoria.</dd></dl><h3>4. Compartilhando via WhatsApp</h3><p>Para facilitar a sua ida ao mercado ou enviar a lista para quem vai comprar:</p><p>No modal de resultado, clique em 📱 Enviar para WhatsApp.</p><p>Digite o nome do organizador quando solicitado.</p><p>O aplicativo abrirá o seu WhatsApp com uma mensagem formatada profissionalmente, contendo:</p><dl><dd>Nome do organizador.</dd><dd>Contagem de convidados.</dd><dd>Lista de compras separada por categorias (🥩 Carnes, 🥤 Bebidas, 🍴 Utensílios).</dd></dl><h2>💡 Dicas de Mestre</h2><dl><dd><b>Variedade vs. Quantidade</b>: Quanto mais tipos de carne você selecionar, menor será a quantidade de cada uma, mas o peso total total será mantido para evitar desperdício.</dd><dd><b>Segurança no Álcool</b>: O cálculo de bebidas alcoólicas considera uma margem de segurança para que a festa não acabe cedo demais.</dd><dd><b>Checklist</b>: Use a mensagem do WhatsApp como um checklist no supermercado, marcando o que já foi colocado no carrinho.</dd></dl><h4>Suporte e Dúvidas</h4><p>Caso encontre algum problema ou tenha sugestões de novos cortes de carne, entre em contato com o administrador através do painel de sugestões.</p><h3>Bom churrasco! 🥩🔥</h3>' }} 
                />
            </div>
        </div>
    );
}