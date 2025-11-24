import fastify from "fastify";

const app = fastify();

app.get("/hello", () => {
  return { message: "Hello, World!" };
});

app.listen({
    port: 4444,
}).then(() => {
    console.log('Servidor rodando na porta 4444 ');
    
})