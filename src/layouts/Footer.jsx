const Footer = () => (
  <footer className="bg-green-700 text-white py-4 mt-8">
    <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
      <span>
        &copy; {new Date().getFullYear()} MiniMarket Express. Todos los derechos
        reservados.
      </span>
      <span className="text-sm">Desarrollado por tu equipo</span>
    </div>
  </footer>
);

export default Footer;
