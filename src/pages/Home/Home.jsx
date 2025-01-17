import React from "react";
import Menu from "../../components/menu/Navbar"; // Certifique-se de ajustar o caminho para o componente Menu conforme necessário
import "./Home.css"; // Adicione estilos personalizados se necessário

const Home = () => {
  return (
          <><Menu /><div>
      <div className="home-container">
        <section className="home-section-a">
         <div className="sobre"> 
         <h1>Sobre a ALL DOOR</h1>
          <p>
            A ALL DOOR é uma empresa especializada em soluções de comunicação
            visual, com foco em inovação e tecnologia. Nosso modelo de negócio
            é baseado no fornecimento de totens de LED instalados em
            condomínios residenciais e comerciais, criando um canal direto de
            comunicação com um público altamente segmentado e qualificado.
            Através desses totens, oferecemos aos nossos clientes a
            possibilidade de alugar tempo de tela para anunciar seus produtos
            e promover suas marcas.
          </p>
         </div>
        </section>

        <section className="home-section">
          <h2>Nossa Proposta de Valor</h2>
          <p>
            A ALL DOOR oferece um novo formato de publicidade digital em
            espaços estratégicos, criando um meio eficaz de promoção local e
            regional. Nossos totens de LED são instalados em pontos de grande
            circulação, garantindo que as mensagens publicitárias alcancem um
            público diversificado e engajado.
          </p>
        </section>

        <section className="home-section">
          <h2>Vantagens da Publicidade em Totens de LED</h2>
          <ul>
            <li>
              <strong>Segmentação e Precisão:</strong> Ao instalar nossos
              totens em condomínios, conseguimos segmentar o público com alta
              precisão, atingindo diretamente residentes e consumidores
              locais.
            </li>
            <li>
              <strong>Alta Visibilidade:</strong> Os totens de LED
              proporcionam uma visibilidade elevada, tanto durante o dia
              quanto à noite, devido à tecnologia de alta definição e brilho.
            </li>
            <li>
              <strong>Tecnologia Interativa:</strong> A interação com o
              público é facilitada pela possibilidade de exibição dinâmica de
              conteúdo (vídeos, imagens, promoções, etc.), o que aumenta o
              engajamento e a retenção da mensagem.
            </li>
            <li>
              <strong>Acessibilidade e Frequência:</strong> Os moradores de
              condomínios têm acesso constante aos totens, garantindo uma
              exposição contínua da marca e maior frequência de visualização.
            </li>
            <li>
              <strong>Baixo Custo e Alta Eficiência:</strong> Comparado a
              outros meios tradicionais de publicidade, como outdoors e TV, o
              aluguel de tempo de tela nos totens é uma opção mais econômica,
              com alto retorno sobre investimento (ROI).
            </li>
          </ul>
        </section>

        <section className="home-section">
          <h2>Nossa Visão</h2>
          <p>
            Ser a plataforma de mídia líder no segmento de comunicação local,
            oferecendo soluções inovadoras e sustentáveis para empresas que
            buscam maximizar o impacto de suas campanhas publicitárias.
          </p>
        </section>
      </div>
    </div></>
  );
};

export default Home;
