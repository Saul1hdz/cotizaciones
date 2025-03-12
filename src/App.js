import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css'; // Importa los estilos CSS

const App = () => {
  // Estado para almacenar el nombre del cliente
  const [cliente, setCliente] = useState('BELLEZA Y COSMETICOS S.A DE C.V.');

  // Estado para almacenar la lista de productos
  const [productos, setProductos] = useState([
    { nombre: 'Licencia Easyfact – Facturación electrónica (Costo Mensual)', cantidad: 2, precio: 50.0 },
  ]);

  // Referencia para el contenido que se convertirá en PDF
  const cotizacionRef = useRef(null);

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
      <h1>Generar Cotización</h1>
      <form
        className="formulario"
        onSubmit={(e) => {
          e.preventDefault(); // Evita que el formulario se envíe
          handleDownloadPDF(); // Genera el PDF
        }}
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

        <h3>Productos</h3>
        {productos.map((producto, index) => (
          <div className="producto" key={index}>
            <div className="campo">
              <label>
                Nombre del producto:
                <input
                  type="text"
                  value={producto.nombre}
                  onChange={(e) => {
                    const nuevosProductos = [...productos];
                    nuevosProductos[index].nombre = e.target.value; // Actualiza el nombre del producto
                    setProductos(nuevosProductos);
                  }}
                />
              </label>
            </div>
            <div className="campo">
              <label>
                Cantidad:
                <input
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) => {
                    const nuevosProductos = [...productos];
                    nuevosProductos[index].cantidad = e.target.value; // Actualiza la cantidad
                    setProductos(nuevosProductos);
                  }}
                />
              </label>
            </div>
            <div className="campo">
              <label>
                Precio:
                <input
                  type="number"
                  value={producto.precio}
                  onChange={(e) => {
                    const nuevosProductos = [...productos];
                    nuevosProductos[index].precio = parseFloat(e.target.value); // Convierte el precio a número
                    setProductos(nuevosProductos);
                  }}
                />
              </label>
            </div>
          </div>
        ))}

        <button type="submit" className="boton">Generar PDF</button>
      </form>

      {/* Contenido que se convertirá en PDF */}
      <div ref={cotizacionRef} style={{ position: 'absolute', left: '-9999px' }}>
        <CotizacionContent cliente={cliente} productos={productos} />
      </div>
    </div>
  );
};

// Componente para el contenido de la cotización
const CotizacionContent = ({ cliente, productos }) => {
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
            <th>Imagen</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td></td>
              <td>{producto.nombre}</td>
              <td>{producto.cantidad}</td>
              <td>${parseFloat(producto.precio).toFixed(2)}</td>
              <td>${(producto.cantidad * parseFloat(producto.precio)).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="4">Sub-Total IVA</td>
            <td>${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="4">Total</td>
            <td>${totalConIva.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <section className="terminos">
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
      </section>

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
