import "server-only";
import { Octokit } from "octokit";
import { GITHUB_TOKEN } from "@/data/serverConstants";

export const octokit = new Octokit({ auth: GITHUB_TOKEN });
