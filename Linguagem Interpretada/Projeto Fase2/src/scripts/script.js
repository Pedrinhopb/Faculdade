ReactDOM.createRoot(document.getElementById('banner1')).render(
  <img src="src/images/banner_1.png" className="d-block w-100" alt="banner 1" />
);

ReactDOM.createRoot(document.getElementById('banner2')).render(
  <img src="src/images/banner_2.png" className="d-block w-100" alt="banner 2" />
);

ReactDOM.createRoot(document.getElementById('banner3')).render(
  <img src="src/images/banner_3.png" className="d-block w-100" alt="banner 3" />
);

ReactDOM.render(
    <div class="placeholder-image">
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=Brand+QR+Auth" alt="QR Code AuthProduct"/></div>,
    document.getElementById('qrcodebackground')
)

ReactDOM.render(
  <a className="navbar-brand" href="./index.html">
    <img
      src="src/images/logo.png"
      alt="Logo"
      height="55"
      className="d-inline-block align-text-center"
    />
  </a>,
  document.getElementById("logonavbar")
);



ReactDOM.render(
  <div>
    <h2>O que fazemos</h2>

    <p>
      A Brand QR Auth é uma plataforma inovadora que oferece rastreabilidade
      completa e autenticação de produtos através de códigos QR únicos.
      Garantimos que cada produto possa ser rastreado desde sua criação até o
      seu destino final, proporcionando segurança, transparência e confiança em
      toda a cadeia de valor.
    </p>

    <ul className="about-features">
      <li>Autenticação de produtos únicos</li>
      <li>Rastreamento em tempo real</li>
      <li>Transferência segura entre usuários</li>
      <li>Geração automática de QR Codes</li>
    </ul>
  </div>,
  document.getElementById("about-text")
);

ReactDOM.render(
    <img
      src="src/images/logo_name.png"
      width="100px"
      alt="Logo AuthProduct"
    />,
    document.getElementById('logo-cell')
)

ReactDOM.render(
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PROD-2026-001-ABC123DEF456" alt="QR Code do Produto"/>,
    document.getElementById('qrcode-cell')
)