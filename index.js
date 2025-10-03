import { argv } from "process";

async function main() {
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

          const response = await fetch(
            `https://fakestoreapi.com/products/${idString}`
          );
          if (!response.ok) {
            throw new Error("Producto no encontrado");
          }
          const data = await response.json();
          console.log(data);
          break;
        } else if (productQuery == "products") {
          const response = await fetch("https://fakestoreapi.com/products");
          if (!response.ok) {
            throw new Error("Error: productos no encontrados");
          }
          const data = await response.json();
          console.log(data);
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
        const response = await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
        if (!response.ok) {
          throw new Error("Falló la creación del producto");
        }
        const data = await response.json();
        console.log(data);
        break;
      }
      case "delete": {
        const productQuery = argv[3];

        if (productQuery && productQuery.startsWith("products/")) {
          const idString = productQuery.split("/")[1];
          const response = await fetch(
            `https://fakestoreapi.com/products/${idString}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            throw new Error("No se pudo eliminar el producto");
          }
          const data = await response.json();
          console.log("Producto eliminado");
          console.log(data);
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
    console.log(`Error: ${err.message}`);
  }
}

main();