import { processHtml } from '../src/piapro-api'
import { expect, test } from 'vitest'
import { readFileSync } from 'node:fs'


test('Parses html', () => {
  const mikuHtml = readFileSync('./_tests/fixture/content_list.html').toString()
  const result = processHtml(mikuHtml, '2025')

  expect(result).toMatchSnapshot()
})