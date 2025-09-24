import { CodegenConfig } from "@graphql-codegen/cli";

const configuration: CodegenConfig = {
  schema: "https://indexer.hyperindex.xyz/dd85139/v1/graphql",
  documents: ["src/lib/hooks/envio/**/*.ts"],
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        enumsAsTypes: true,
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default configuration;
