import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css'; // Importa los estilos CSS

const App = () => {
  // Estado para almacenar el nombre del cliente
  const [cliente, setCliente] = useState('BELLEZA Y COSMETICOS S.A DE C.V.');

  // Estado para almacenar la lista de productos
  const [productos, setProductos] = useState([]);

  // Estado para el producto actual que se está agregando
  const [productoActual, setProductoActual] = useState({
    nombre: '',
    cantidad: 1,
    precio: 0.0,
  });

  // Estado para controlar la visibilidad del modal de configuración
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estado para los datos de configuración
  const [configuracion, setConfiguracion] = useState({
    nit: '1234-567890-123-4',
    nrc: '12345678',
    razonSocial: 'BELLEZA Y COSMETICOS S.A DE C.V.',
    nombreComercial: 'BELLEZA Y COSMETICOS',
    actividadEconomica: 'Venta de productos de belleza y cosméticos',
  });

  // Referencia para el contenido que se convertirá en PDF
  const cotizacionRef = useRef(null);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoActual({
      ...productoActual,
      [name]: name === 'cantidad' || name === 'precio' ? parseFloat(value) : value,
    });
  };

  // Función para manejar cambios en los campos de configuración
  const handleChangeConfiguracion = (e) => {
    const { name, value } = e.target;
    setConfiguracion({
      ...configuracion,
      [name]: value,
    });
  };

  // Función para agregar un nuevo producto a la lista
  const agregarProducto = (e) => {
    e.preventDefault(); // Evita que el formulario se envíe

    if (productoActual.nombre && productoActual.cantidad && productoActual.precio) {
      setProductos([...productos, productoActual]); // Agrega el producto a la lista
      setProductoActual({ nombre: '', cantidad: 1, precio: 0.0 }); // Reinicia el formulario
    } else {
      alert('Por favor, complete todos los campos del producto.');
    }
  };

  // Función para generar el PDF
  const handleDownloadPDF = () => {
    const input = cotizacionRef.current;

    // Espera a que todas las imágenes se carguen
    const images = input.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve; // Ignora errores de carga
        }
      });
    });

    // Espera a que todas las imágenes estén listas
    Promise.all(imagePromises).then(() => {
      setTimeout(() => {
        html2canvas(input, { scale: 2 }) // Captura el contenido como imagen
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png'); // Convierte la imagen a base64
            const pdf = new jsPDF('p', 'mm', 'a4'); // Crea un nuevo PDF
            const imgWidth = 210; // Ancho de la página A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calcula la altura de la imagen

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Agrega la imagen al PDF
            pdf.save('cotizacion.pdf'); // Descarga el PDF
          })
          .catch((error) => {
            console.error('Error al generar el PDF:', error);
          });
      }, 500); // Retraso de 500 ms para asegurar que el contenido esté listo
    });
  };

  return (
    <div className="app">
      {/* Ícono de configuración */}
      <div className="icono-configuracion" onClick={() => setModalAbierto(true)}>
        ⚙️
      </div>

      {/* Modal de configuración */}
      {modalAbierto && (
        <div className="modal">
          <div className="modal-contenido">
            <h2>Configuración</h2>
            <div className="campo">
              <label>
                Nit:
                <input
                  type="text"
                  name="nit"
                  value={configuracion.nit}
                  onChange={handleChangeConfiguracion}
                />
              </label>
            </div>
            <div className="campo">
              <label>
                Nrc:
                <input
                  type="text"
                  name="nrc"
                  value={configuracion.nrc}
                  onChange={handleChangeConfiguracion}
                />
              </label>
            </div>
            <div className="campo">
              <label>
                Nombre o razón social:
                <input
                  type="text"
                  name="razonSocial"
                  value={configuracion.razonSocial}
                  onChange={handleChangeConfiguracion}
                />
              </label>
            </div>
            <div className="campo">
              <label>
                Nombre comercial:
                <input
                  type="text"
                  name="nombreComercial"
                  value={configuracion.nombreComercial}
                  onChange={handleChangeConfiguracion}
                />
              </label>
            </div>
            <div className="campo">
              <label>
                Actividad económica:
                <input
                  type="text"
                  name="actividadEconomica"
                  value={configuracion.actividadEconomica}
                  onChange={handleChangeConfiguracion}
                />
              </label>
            </div>
            <button
              className="boton cerrar"
              onClick={() => setModalAbierto(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <h1>Generar Cotización</h1>
      <form
        className="formulario"
        onSubmit={agregarProducto} // Agrega el producto al enviar el formulario
      >
        <div className="campo">
          <label>
            Nombre del cliente:
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)} // Actualiza el estado del cliente
            />
          </label>
        </div>

        <h3>Agregar Producto</h3>
        <div className="campo">
          <label>
            Nombre del producto:
            <input
              type="text"
              name="nombre"
              value={productoActual.nombre}
              onChange={handleChange} // Maneja cambios en el nombre
            />
          </label>
        </div>
        <div className="campo">
          <label>
            Cantidad:
            <input
              type="number"
              name="cantidad"
              value={productoActual.cantidad}
              onChange={handleChange} // Maneja cambios en la cantidad
            />
          </label>
        </div>
        <div className="campo">
          <label>
            Precio:
            <input
              type="number"
              name="precio"
              value={productoActual.precio}
              onChange={handleChange} // Maneja cambios en el precio
            />
          </label>
        </div>

        {/* Botón para agregar el producto */}
        <button type="submit" className="boton agregar">
          AGREGAR PRODUCTO
        </button>
      </form>

      {/* Lista de productos */}
      <div className="lista-productos">
        <h3>Lista de Productos</h3>
        <table className="tabla-lista">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>${parseFloat(producto.precio).toFixed(2)}</td>
                <td>${(producto.cantidad * parseFloat(producto.precio)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista previa del PDF */}
      <div className="preview-pdf">
        <h3>Vista Previa del PDF</h3>
        <div className="preview-contenido">
          <CotizacionContent
            cliente={cliente}
            productos={productos}
            configuracion={configuracion}
          />
        </div>
      </div>

      {/* Botón para generar el PDF */}
      <button type="button" className="boton generar" onClick={handleDownloadPDF}>
        Generar PDF
      </button>

      {/* Contenido que se convertirá en PDF (oculto) */}
      <div ref={cotizacionRef} style={{ position: 'absolute', left: '-9999px' }}>
        <CotizacionContent
          cliente={cliente}
          productos={productos}
          configuracion={configuracion}
        />
      </div>
    </div>
  );
};

// Componente para el contenido de la cotización
const CotizacionContent = ({ cliente, productos, configuracion }) => {
  // Calcula el total, subtotal, IVA y total con IVA
  const total = productos.reduce((sum, producto) => sum + producto.cantidad * parseFloat(producto.precio), 0);
  const subtotal = total;
  const iva = subtotal * 0.13; // IVA del 13%
  const totalConIva = subtotal + iva;

  return (
    <div className="cotizacion">
      <header className="header">
        <h1>Cotización No. A&K-BC003</h1>
        <p className="fecha">Fecha: 21/02/2025</p>
      </header>

      <section className="cliente">
        <p>Estimados:</p>
        <p><strong>{cliente}</strong></p>
      </section>

      {/* Información de configuración */}
      <section className="configuracion">
        <p><strong>Nit:</strong> {configuracion.nit}</p>
        <p><strong>Nrc:</strong> {configuracion.nrc}</p>
        <p><strong>Nombre o razón social:</strong> {configuracion.razonSocial}</p>
        <p><strong>Nombre comercial:</strong> {configuracion.nombreComercial}</p>
        <p><strong>Actividad económica:</strong> {configuracion.actividadEconomica}</p>
      </section>

      <section className="descripcion">
        <p>
          Es un placer saludarle y desearle el mejor de los éxitos en sus proyectos. Valoramos profundamente la confianza que
          depositan en nosotros para atender sus necesidades tecnológicas. A continuación se detalla la cotización de licencia de
          EasyFact para 2 sucursales.
        </p>
      </section>

      <table className="tabla">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td>{producto.nombre}</td>
              <td>{producto.cantidad}</td>
              <td>${parseFloat(producto.precio).toFixed(2)}</td>
              <td>${(producto.cantidad * parseFloat(producto.precio)).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3">Sub-Total IVA</td>
            <td>${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="3">Total</td>
            <td>${totalConIva.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* <section className="terminos">
        <h2>TÉRMINOS Y CONDICIONES</h2>
        <ol>
          <li>Los precios descritos son al contado, efectivo o cheque.</li>
          <li>Cheques a nombre de A y K TECHNOLOGY S.A.S DE C.V.</li>
          <li>Número de cuenta BAC: 201514973.</li>
          <li>El pago es un pago recurrente mensual.</li>
          <li>Documentos emitidos ilimitados.</li>
          <li>Usuario para su contador Ing. Osmin Ariel Lopez Claros.</li>
          <li>Usuarios ilimitados.</li>
          <li>Envío de facturas a los clientes por correo y por WhatsApp.</li>
          <li>Mejoras continuas al software.</li>
        </ol>
      </section> */}

      <footer className="footer">
        <p>
          Realizamos software a la medida con las mejores tecnologías del mercado y según sea la necesidad de su
          empresa o negocio.
        </p>
      </footer>
    </div>
  );
};

export default App;