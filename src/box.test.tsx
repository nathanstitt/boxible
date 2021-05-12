/* global describe, it, expect */
import React from 'react'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import { Box } from './box'
import { SIZES } from './styles'


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
    })

    it('allows hacking sizes', () => {
        SIZES.large = '100px'
        const box = renderer.create(<Box margin="medium" pad={{ top: 'small' }}>l</Box>)
        expect(box).toMatchSnapshot()
    })
})
