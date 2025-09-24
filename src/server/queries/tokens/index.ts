"use server";

import { ASSETS_REPO_SLUG } from "@/data/serverConstants";
import { octokit } from "@/lib/octokit";
import { TToken, TokenlistSchema } from "@/lib/types";
import { z } from "zod";

export async function getTokenlist(chainId: number) {
  // Get slug, and split
  const slug = ASSETS_REPO_SLUG.split("/");
  const repo = slug[0]; // Repository name
  const path = `${slug[1]}/${slug[2]}/${slug[3]}/${slug[4]}`.replace(
    "{chainId}",
    String(chainId)
  );
  const { data } = await octokit.rest.repos.getContent({
    repo,
    owner: "Reactor-Finance",
    path,
  });

  if ("content" in data) {
    // Content as buffer
    const asBuffer = Buffer.from(data.content, "base64");
    // Stringify and parse
    const tokenlist = JSON.parse(asBuffer.toString());
    // Run schema check
    const {
      data: value,
      error,
      success,
    } = TokenlistSchema.safeParse(tokenlist);

    if (!success && error) return Promise.reject(error);
    return !!value ? value : ([] as z.infer<typeof TokenlistSchema>);
  }
  return [] as TToken[];
}
