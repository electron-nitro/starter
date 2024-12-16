
// / routes/users.post.ts
export default defineEventHandler(async event => {
  const body = await readBody(event)

  // Do something with body like saving it to a database

  return { updated: true }
})

