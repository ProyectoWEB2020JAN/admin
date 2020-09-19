const {Router} = require('express');
const router = Router();


const controlador = require('../controller/admin.controller');

router.get('/', controlador.inicio);
router.get('/productos', controlador.productos);
router.get('/entregados', controlador.entregados);
router.get('/carrusel', controlador.carrusel);
router.get('/login', controlador.login);

router.post('/subirProducto',controlador.subirProducto);
router.get('/eliminarProducto/:idProducto', controlador.eliminarProductos);

module.exports = router;