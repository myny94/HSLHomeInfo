
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  documents: ['src/**/*.graphql'],
  schema: "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", 'typescript-react-apollo']
    }
  }
};

export default config;
