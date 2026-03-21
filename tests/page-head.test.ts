import { describe, expect, it } from 'vitest'

import { createPageHead } from '../src/lib/page-head'

describe('createPageHead', () => {
  it('returns a head function with a title meta entry', () => {
    const head = createPageHead('注册')

    expect(head()).toEqual({
      meta: [{ title: '注册' }],
    })
  })
})
