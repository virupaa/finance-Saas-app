import {z} from "zod";
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import accounts  from "./accounts"
import categories from "./categories";
import transactions  from "./transactions";
import summary from "./summary";

export const runtime = "edge";

const app = new Hono().basePath('/api')



// app.route("/authors", authors);
// app.route("/books", books);

// app.get('/hello',(c) => {
//     return c.json({hello: "World"})
// })

const routes = app
    .route("/accounts",accounts)
    .route("/categories",categories)
    .route("/transactions",transactions)
    .route("/summary", summary);

// app.get('/hello', 
//         clerkMiddleware(),
//   (c) => {
//     const auth = getAuth(c);
     
//     if(!auth?.userId) {
//         return c.json({
//             error: "Unauthorized"
//         });
//     }


//   return c.json({
//     message: 'Hello Next.js!',
//     userId: auth.userId
//   })
// })
// .get("/hello/:test", 
//      (c) => {
//     return c.json({
//         message:"Hello World",
       
//     })

// })

// .post(
//     "/create/:postId",
//     zValidator("json", z.object({
//         name: z.string(),
//         userId: z.number(),
//     })),
//     zValidator("param", z.object({
//         postId: z.number(),
//     })),
//     (c) => {
//         const {name, userId} = c.req.valid("json");
//         const {postId} = c.req.valid("param");

//         return c.json({});
//     }
// )

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);


export type AppType = typeof routes;