const Support = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">Soporte y Ayuda 🆘</h2>
      <p className="text-lg dark:text-gray-400">
        Encuentra guías y soluciones a problemas comunes.
      </p>
      <div className="mt-6 space-y-4 dark:text-gray-300">
        <h3 className="text-2xl font-semibold text-indigo-600 dark:text-purple-400">Preguntas Frecuentes (FAQ)</h3>
        <p>• ¿Cómo registro un nuevo personaje? *Solo los **administradores** pueden hacerlo a través del botón "Crear Nuevo".*</p>
        <p>• Olvidé mi contraseña: *Actualmente, debes contactar a un administrador por Email.*</p>
      </div>
    </div>
  );
};

export default Support;