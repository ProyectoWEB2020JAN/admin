const controlador = {};
const cron = require("node-cron");

const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDrCqZt8kJasSAmZcxEssZvbH7ozKQG2NQ",
  authDomain: "proyectoweb-baddd.firebaseapp.com",
  databaseURL: "https://proyectoweb-baddd.firebaseio.com",
  projectId: "proyectoweb-baddd",
  storageBucket: "proyectoweb-baddd.appspot.com",
  messagingSenderId: "652891057870",
  appId: "1:652891057870:web:841d32fc1fe8200b9eea9f",
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

class esentials {
  constructor() {
    this.productos = null;
    this.pedidos = null;
  }

  setProductos(productos) {
    this.productos = productos;
  }
  setPedidos(pedidos) {
    this.pedidos = pedidos;
  }
}
var esencial = new esentials();

class productos {
  constructor(Completas, Porciones) {
    this.Completas = Completas;
    this.Porciones = Porciones;
  }
}

class pedidos {
  constructor(pendientes, aceptados) {
    this.pendientes = pendientes;
    this.aceptados = aceptados;
  }
}

controlador.subirProducto = async (req, res) => {
  let producto = req.body;
  let idProducto = producto.nombre.replace(/ /g, "") + "-" + producto.tipo;
  db.collection("Productos")
    .doc(idProducto)
    .set({
      nombre: producto.nombre,
      tipo: producto.tipo,
      precio: producto.precio,
      descripcion: producto.descripcion,
      idProducto: idProducto,
    })
    .then(() => {
      console.log("Document written with ID: ", idProducto);
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
  res.render("productos/productos", {
    products: await importProducts(),
  });
};

const importProducts = () => {
  return new Promise((resolve) => {
    let products;
    let Porciones = [];
    let Completas = [];
    db.collection("Productos")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().tipo == "Porcion") {
            Porciones.push(doc.data());
          } else {
            Completas.push(doc.data());
          }
        });
        products = new productos(Completas, Porciones);
        resolve(products);
      })
      .catch(function (error) {
        console.log("Error: ", error);
      });
  });
};

controlador.eliminarProductos = (req, res) => {
  db.collection("Productos")
    .doc(req.params.idProducto)
    .delete()
    .then(() => {
      console.log("DELETED: " + req.params.idProducto);
    })
    .catch(function (error) {
      console.log("Error: ", error);
    });
  res.redirect("productos/productos");
};

const importPedidos = () => {
  return new Promise((resolve) => {
    let pedidosuser;
    let pendiente = [];
    let aceptados = [];
    db.collection("pedidos")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().estado == "pendiente") {
            pendiente.push(doc.data());
          } else {
            aceptados.push(doc.data());
          }
        });
        pedidosuser = new pedidos(pendiente, aceptados);
        resolve(pedidosuser);
      })
      .catch(function (error) {
        console.log("Error: ", error);
      });
  });
};

// RUTAS:
controlador.inicio = async (req, res) => {
  await actualizer();
  res.render("index", { esencial });
};

controlador.productos = async (req, res) => {
  await actualizer();
  res.render("productos/productos", { esencial });
};

controlador.entregados = async (req, res) => {
  await actualizer();
  res.render("entregados/entregados", { esencial });
};

controlador.carrusel = async (req, res) => {
  await actualizer();
  res.render("carrusel/carrusel", { esencial });
};

controlador.login = async (req, res) => {
  await actualizer();
  res.render("login/login", { esencial });
};

controlador.admin = async (req, res) => {
  await actualizer();
  res.render("./admin", { esencial });
};

const actualizer = async () => {
  esencial.setProductos(await importProducts());
  esencial.setPedidos(await importPedidos());
};

cron.schedule("*/5 * * * * *", async () => {
  await actualizer();
});

module.exports = controlador;
