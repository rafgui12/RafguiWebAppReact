import { Link } from 'react-router';
import { HiOutlineHome } from 'react-icons/hi'; // Ícono de "home"

function NotFoundPage() {
  return (
    // Contenedor principal: Ocupa toda la pantalla y centra el contenido
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden p-6">
      
      {/* Fondo de gradiente (el mismo que en tus otras páginas) */}
      <div className="absolute inset-0 z-0 opacity-50 bg-gradient-to-b from-black via-black to-purple-900/40" />

      {/* Contenido (con z-index para estar por encima del fondo) */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* El "404" grande */}
        {/* Usamos 'font-black' para que sea súper grueso y un poco transparente */}
        <h1 className="text-8xl md:text-9xl font-black text-purple-400 opacity-75">
          404
        </h1>

        {/* Mensaje principal */}
        <h2 className="text-3xl md:text-5xl font-bold mt-4">
          Perdido en el Espacio
        </h2>

        {/* Descripción */}
        <p className="text-lg text-gray-300 mt-4 max-w-md">
          Parece que te has desviado a un sector desconocido de la galaxia. 
          La página que buscas no existe o fue movida a otra dimensión.
        </p>

        {/* Botón para volver al inicio */}
        <Link
          to="/" // Apunta a tu ruta de inicio
          className="inline-flex items-center space-x-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg mt-8
                     hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30
                     transition-all duration-300"
        >
          <HiOutlineHome className="w-5 h-5" />
          <span>Volver a la base</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;