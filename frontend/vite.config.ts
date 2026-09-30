import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import { qwikCity } from '@builder.io/qwik-city/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// Resolve the commit hash cross-platform: prefer the COMMIT_HASH env var when
// provided (CI/deploy), otherwise fall back to reading it from git directly.
// This replaces the bash-only `export COMMIT_HASH=$(git rev-parse HEAD)`.
function resolveCommitHash(): string | undefined {
	const fromEnv = process.env['COMMIT_HASH']
	if (fromEnv) {
		return fromEnv.slice(0, 7)
	}
	try {
		return execSync('git rev-parse HEAD').toString().trim().slice(0, 7)
	} catch {
		return undefined
	}
}

const commitHash = resolveCommitHash()

export default defineConfig(() => {
	return {
		define: {
			COMMIT_INFO: JSON.stringify({ hash: commitHash }),
		},
		plugins: [
			qwikCity({
				trailingSlash: false,
			}),
			qwikVite(),
			tsconfigPaths(),
		],
		preview: {
			headers: {
				'Cache-Control': 'public, max-age=600',
			},
		},
	}
})
