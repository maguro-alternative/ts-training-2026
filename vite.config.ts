/// <reference types="vitest" />
import { defineConfig } from 'vite';

// EXERCISE 環境変数で typecheck 対象を絞る
// 例: EXERCISE=01-basic-types npm test
const exercise = process.env.EXERCISE;

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    reporters: ['default'],
    typecheck: {
      enabled: true,
      ignoreSourceErrors: !!exercise,
      include: exercise
        ? [`src/**/*${exercise}*/*.test.ts`]
        : ['src/**/*.test.ts'],
    },
  },
});
