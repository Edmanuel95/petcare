import { mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('qa-proxy', { recursive: true })
writeFileSync('qa-proxy/robots.txt', 'User-agent: *\nDisallow: /\n')
