import { execSync } from 'node:child_process'
import { test, expect } from 'vitest'

test('route tree builds without conflicting paths', () => {
  expect(() => {
    execSync('npm run build', {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
    })
  }).not.toThrow()
})
