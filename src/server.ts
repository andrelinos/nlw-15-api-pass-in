import fastify from "fastify";

const app = fastify()

app.get('/', (req, res) => {
  return 'Hello NLW Unite'
})

app.listen({ port: 3333}).then(() => {
  console.log('🔥 Server running on port 3333')
});