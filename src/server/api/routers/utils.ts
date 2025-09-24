import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const utilsRouter = createTRPCRouter({
  test: publicProcedure
    .input(z.object({ test: z.string() }))
    .query(async ({ input }) => {
      console.log(input.test);
      // return await executeGetBlockNumber();
    }),
});
