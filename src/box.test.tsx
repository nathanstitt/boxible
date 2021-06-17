/* global describe, it, expect */
import React from 'react'
import renderer from 'react-test-renderer'
import { matchers } from '@emotion/jest'
import { Box } from './box'
import { SIZES } from './styles'


// Add the custom matchers provided by '@emotion/jest'
expect.extend(matchers)

describe('Box Component', () => {
    beforeEach(() => SIZES.large = '1rem')

    it('renders and matches snapshot', () => {
        const tree = renderer.create(
            <Box
                align="stretch"
                alignContent="end"
                direction="column"
                flex={{ grow: '2', shrink: '1' }}
                basis="1/2"
                justify="evenly"
                gap="medium"
                height={{ min: '20%' }}
                width={{ max: '80%' }}
                fill="vertical"
                wrap
                className="a-box-for-testing"
                id="1"
                pad="large"
                margin="small"
            >
                A test
            </Box>
        ).toJSON();
        expect(tree).toMatchSnapshot();
        expect(tree).toHaveStyleRule('margin', '.2rem')
        expect(tree).toHaveStyleRule('padding', '1rem')
        expect(tree).toHaveStyleRule('flex-wrap', 'wrap')
    })

    it('allows hacking sizes', () => {
        SIZES.large = '103px'
        const box = renderer.create(<Box margin="top" pad={{ top: 'large' }}>l</Box>)
        expect(box.toJSON()).toHaveStyleRule('padding-top', '103px')
        expect(box).toMatchSnapshot();
    })
})
