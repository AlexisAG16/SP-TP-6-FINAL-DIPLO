import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
      
      {/* Estilo Gótico para el error */}
      <h1 className="text-9xl font-extrabold text-red-700 dark:text-purple-600 transition duration-300">
        404
      </h1>
      <p className="text-3xl font-semibold mt-4 mb-6 text-gray-800 dark:text-gray-200">
        Page Not Found
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
        The realm you seek does not exist, or perhaps it was devoured by a mystical creature.
      </p>

      <Link 
        to="/characters"
        className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg 
        shadow-lg dark:bg-purple-600 dark:hover:bg-purple-700 transition duration-300"
      >
        Return to the List of Characters
      </Link>
    </div>
  );
};

export default NotFound;