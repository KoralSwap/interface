import { z } from "zod";

export const searchParamsSchema = z.object({
  version: z.enum(["stable", "volatile", "concentrated"]),
});
