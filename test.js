console.log('Iniciando prueba de Node.js...');
console.log('Node.js versión:', process.version);
console.log('Directorio actual:', process.cwd());

try {
  import('express').then(express => {
    console.log('✅ Express importado correctamente');
    const app = express.default();
    const PORT = 3001;
    
    app.get('/', (req, res) => {
      res.json({ message: 'Servidor de prueba funcionando' });
    });
    
    app.listen(PORT, () => {
      console.log(`✅ Servidor de prueba corriendo en puerto ${PORT}`);
    });
  }).catch(err => {
    console.error('❌ Error importando express:', err);
  });
} catch (error) {
  console.error('❌ Error general:', error);
}
