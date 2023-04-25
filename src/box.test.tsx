/* global describe, it, expect */
import React from 'react'
import renderer from 'react-test-renderer'
import { matchers } from '@emotion/jest'
import { Box, extractBoxibleProps } from './box'
import { SIZES, SCREEN_SIZES } from './styles'


// Add the custom matchers provided by '@emotion/jest'
expect.extend(matchers)

describe('Box Component', () => {
    beforeEach(() => {
        SIZES.large = '1rem'
        SCREEN_SIZES.lg = 'min-width: 992px'
    })

    it('renders and matches snapshot', () => {
        const tree = renderer.create(
            <Box
                align="stretch"
                alignContent="end"
                direction="columnReverse"
                flex={{ grow: 2, shrink: 1 }}
                basis="1/2"
                justify="evenly"
                gap="medium"
                height={{ min: '20%' }}
                width={{ max: '80%' }}
                fill="vertical"
                wrap
                className="a-box-for-testing"
                id="1"
                padding="large"
                margin="small"
            >
                A test
            </Box>
        ).toJSON();
        expect(tree).toMatchSnapshot()
        expect(tree).toHaveStyleRule('margin', '.2rem')
        expect(tree).toHaveStyleRule('padding', '1rem')
        expect(tree).toHaveStyleRule('flex-wrap', 'wrap')
    })

    it('supports numbers for sizes', () => {
        const tree = renderer.create(
            <Box padding={10} margin={{ left: 11, right: '1rem' }} >something</Box>
        ).toJSON()
        expect(tree).toHaveStyleRule('padding', '10px')
        expect(tree).toHaveStyleRule('margin-left', '11px')
        expect(tree).toHaveStyleRule('margin-right', '1rem')
    })
    it('can set shrink/grow/basis at once', () => {
        const tree = renderer.create(
            <Box flex={{ grow: 3, shrink: false, basis: '1/2' }}>something</Box>
        ).toJSON()
        expect(tree).toMatchSnapshot()
        expect(tree).toHaveStyleRule('flex', '3 0 50%')
        expect(
            renderer.create(<Box flex={{ basis: '42.2%' }}>something</Box>).toJSON()
        ).toHaveStyleRule('flex', '1 1 42.2%')
    })
    it('allows hacking sizes', () => {
        SIZES.large = '103px'
        SCREEN_SIZES.lg = 'min-width: 1001px'
        const box = renderer.create(<Box margin="top" justify={{ lg: 'start' }} padding={{ top: 'large' }}>l</Box>)
        const tree = box.toJSON()
        expect(tree).toHaveStyleRule('padding-top', '103px')
        expect(tree).toHaveStyleRule('justify-content', 'flex-start', {
            media: `@media (min-width: 1001px)`,
        })
        expect(box).toMatchSnapshot();
    })

    it('renders using `as`', () => {
        const box = renderer.create(<Box as="button">btn</Box>).toJSON() as any
        expect(box['type']).toEqual('button')
    })

    it('is responsive', () => {
        const box = renderer.create(<Box justify={{ lg: 'evenly' }} align={{ md: 'stretch' }} alignContent={{ sm: 'end', lg: 'between' }}>btn</Box>)
        expect(box).toMatchSnapshot()
        const tree = box.toJSON()
        expect(tree).toHaveStyleRule('align-items', 'stretch', {
            media: `@media (${SCREEN_SIZES.md})`,
        })
        expect(tree).toHaveStyleRule('justify-content', 'space-evenly', {
            media: `@media (${SCREEN_SIZES.lg})`,
        })
        expect(tree).toHaveStyleRule('align-content', 'space-between', {
            media: `@media (${SCREEN_SIZES.lg})`,
        })
    })

    it('can extract props', () => {
        type OtherProps = { other: string }

        const [boxProps, others] = extractBoxibleProps<OtherProps>({
            other: 'a',
            className: 'b',
            align: 'center',
        })
        expect(boxProps).toEqual({ align: 'center', className: 'b' })
        expect(others).toEqual({ other: 'a'  })
    })
})
