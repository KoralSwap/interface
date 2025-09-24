import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getTokenlist } from "@/server/queries/tokens";
import { z } from "zod";

export const tokensRouter = createTRPCRouter({
  getTokens: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional().default(""),
        chainId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const tokenlist = await getTokenlist(input.chainId);
      return !input.searchQuery ||
        input.searchQuery === null ||
        input.searchQuery.trim().length === 0
        ? tokenlist
        : tokenlist.filter(
            (token) =>
              token.symbol
                .toLowerCase()
                .startsWith(input.searchQuery.toLowerCase()) ||
              token.address
                .toLowerCase()
                .startsWith(input.searchQuery.toLowerCase()) ||
              token.name
                .toLowerCase()
                .startsWith(input.searchQuery.toLowerCase())
          );
    }),
});
