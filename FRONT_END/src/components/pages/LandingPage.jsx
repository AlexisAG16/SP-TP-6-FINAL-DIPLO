import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[75vh] text-center md:text-left p-8">
      
      <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight text-indigo-700 dark:text-purple-400 transition duration-300">
          Personajes <br /> <strong>Sobrenaturales</strong>
        </h1>
        <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
          Explora la base de datos más completa de magos, vampiros, brujas y licántropos.
        </p>
        <Link 
          to="/characters" 
          className="mt-8 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg dark:bg-purple-600 dark:hover:bg-purple-700 transition duration-300 transform hover:scale-105"
        >
          Explorar Personajes
        </Link>
      </div>

      <div className="md:w-1/2">
        {/* Etiqueta para una imagen de fantasía o criaturas sobrenaturales */}
        
      </div>
      
    </div>
  );
};

export default LandingPage;