import styled, { CSSObject } from '@emotion/styled'
import type { Property } from 'csstype'

import {
    edgeStyle, overflowStyle, genericStyles, GenericProps, Area, Size, Side,
    SIZES, ALIGN_MAP, ALIGN_CONTENT, BASIS, JUSTIFY, FLEX,
} from './styles'

const basisStyle = (basis: string | keyof typeof BASIS) => (
    `flex-basis: ${BASIS[basis] || basis}`
)

type directionT = 'column' | 'row'

const directionStyle = (direction: directionT) => {
    return {
        minWidth: 0,
        minHeight: 0,
        flexDirection: direction,
    }
}


interface FlexGrowShrinkI {
    grow?: string
    shrink?: string
}

type FlexGrowT = boolean | keyof typeof FLEX | FlexGrowShrinkI

const flexStyle = (flex: FlexGrowT, basis?: string | keyof typeof BASIS) => {
    let flexStyle = ''
    if (typeof flex === 'boolean') {
        flexStyle = flex ? '1 1' : '0 0'
    }

    if (typeof flex == 'string') {
        flexStyle = FLEX[flex]
    }

    const basisStyle = flex !== true && !basis ? ' auto' : ''

    return `flex: ${flexStyle}${basisStyle}; `
}

const fillStyle = (fillProp: string | boolean) => {
    if (fillProp === 'horizontal') {
        return 'width: 100%;'
    }
    if (fillProp === 'vertical') {
        return 'height: 100%;'
    }
    if (fillProp) {
        return { width: '100%', height: '100%' }
    }
    return undefined
}

const justifyStyle = (justify: keyof typeof JUSTIFY) => (
    `justify-content: ${JUSTIFY[justify]};`
)

const WRAP_MAP = {
    reverse: 'wrap-reverse' as Property.FlexWrap,
}

type WrapT = boolean | keyof typeof WRAP_MAP

const wrapStyle = (wrap: WrapT): CSSObject | undefined => {
    if (typeof wrap === 'boolean') {
        return wrap ? { flexWrap: 'wrap' } : undefined
    }
    return { flexWrap: WRAP_MAP[wrap] }
}

interface MinMax {
    max?: string
    min?: string
}

const widthStyle = (w: string | MinMax) => {
    if (typeof w === 'object') {
        const c: any = {}
        if (w.max) c.maxWidth = w.max
        if (w.min) c.minWidth = w.min
        return c
    } else {
        return `width: ${w};`
    }
}

const heightStyle = (w: string | MinMax) => {
    if (typeof w === 'object') {
        const c: any = {}
        if (w.max) c.maxHeight = w.max
        if (w.min) c.minHeight = w.min
        return c
    } else {
        return `height: ${w};`
    }
}

const gapStyle = (gapProp: string | true) => {
    let gap = gapProp
    if (typeof gapProp === 'boolean') {
        if (gap) {
            gap = 'default'
        } else {
            return
        }
    }
    const size = SIZES[gap as string] || gap
    return { gap: size };
}

export interface BoxProps extends GenericProps {
    align?: keyof typeof ALIGN_MAP
    alignContent?: keyof typeof ALIGN_CONTENT
    direction?: directionT
    flex?: FlexGrowT
    basis?: string | keyof typeof BASIS
    justify?: keyof typeof JUSTIFY
    gap?: boolean | Size
    height?: string | MinMax
    width?: string | MinMax
    fill?: boolean | 'horizontal' | 'vertical'
    wrap?: WrapT
    className?: string
    pad?: Size | Area | Side

}

const OWN_PROPS = [
    'basis', 'align', 'alignContent', 'direction', 'overflowProp', 'flex', 'justify',
    'gap', 'height', 'width', 'fill', 'wrap', 'margin', 'pad', 'padding', 'alignSelf', 'gridArea',
]

// NOTE: basis must be after flex! Otherwise, flex overrides basis
export const Box = styled('div', {
    shouldForwardProp: (prop) => !OWN_PROPS.includes(prop as string)
}) <BoxProps>`
    display: flex;
    box-sizing: border-box;
    outline: none;
    ${props => !props.basis && 'max-width: 100%;'};
    ${props => props.align && `align-items: ${ALIGN_MAP[props.align]};`}
    ${props => props.alignContent && `align-content: ${ALIGN_CONTENT[props.alignContent]};`}
    ${props => props.direction && directionStyle(props.direction)}
    ${(props: any) => props.overflowProp && overflowStyle(props.overflowProp)}
    ${({ flex, basis }) => flex && flexStyle(flex, basis)}
    ${({ basis }) => basis && basisStyle(basis)}
    ${({ justify }) => justify && justifyStyle(justify)}
    ${({ gap }: any) => gap && gapStyle(gap)}
    ${({ height }) => height && heightStyle(height)}
    ${({ width }) => width && widthStyle(width)}
    ${({ fill }) => fill && fillStyle(fill)}
    ${({ wrap }) => wrap && wrapStyle(wrap)}
    ${props => props.pad && edgeStyle('padding', props.pad)}
    ${props => genericStyles(props)}
`
