import { argv } from "process";

if (argv.length < 3) {
  console.log("Uso: npm run start <method> [arguments]");
  process.exit(1);
}
const method = argv[2].toLowerCase();

try {
  switch (method) {
    case "get": {
      const productQuery = argv[3];

      if (productQuery && productQuery.startsWith("products/")) {
        const idString = productQuery.split("/")[1];

        fetch(`https://fakestoreapi.com/products/${idString}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error: Producto no encontrado");
            }
            return response.json();
          })
          .then((data) => console.log(data))
          .catch((err) => {
            console.log(`Error: ${err.message}`);
          });
        break;
      } else if (productQuery == "products") {
        fetch("https://fakestoreapi.com/products")
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((err) => console.log(`Error: ${err.message}`));
        break;
      } else {
        console.log("Error: Argumento no reconocido");
        console.log("Argumentos validos: products, products/<id>");
        break;
      }
    }
    case "post": {
      const [, , , , title, price, category] = argv;
      const product = {
        title: title,
        price: Number(price),
        category: category,
      };
      fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear un producto");
          }
          return response.json();
        })
        .then((data) => console.log(data));
      break;
    }
    case "delete": {
      const productQuery = argv[3];

      if (productQuery && productQuery.startsWith("products/")) {
        const idString = productQuery.split("/")[1];
        fetch(`https://fakestoreapi.com/products/${idString}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Producto eliminado!");
            console.log(data);
          })
          .catch((err) => console.log(`Error: ${err.message}`));

        break;
      } else {
        console.log("Eror: Para eliminar un producto use products/<id>");
        break;
      }
    }
    default: {
      console.log(`Error: Método '${method}' no reconocido`);
      console.log("Métodos válidos: get, post, delete");
      break;
    }
  }
} catch (err) {
  console.log(`Error inesperado: ${err.message}`);
}
