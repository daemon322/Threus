import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative mb-10">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <FaSearch className="text-gray-400" />
    </div>
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar productos (nombre, categoría, marca)..."
      className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
    />
    {searchTerm && (
      <button
        onClick={() => setSearchTerm("")}
        className="absolute right-2.5 bottom-2.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Limpiar
      </button>
    )}
  </div>
);

export default SearchBar;
