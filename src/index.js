import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Importa el componente principal
import './App.css'; // Importa los estilos CSS

// Renderiza la aplicación en el elemento con id "root"
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);