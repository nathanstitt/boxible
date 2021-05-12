import styled, { css } from 'styled-components'
import {
    edgeStyle, overflowStyle, genericStyles, GenericPropsI, Area, SizeT,
    SIZES, ALIGN_MAP, ALIGN_CONTENT, BASIS, JUSTIFY, FLEX,
} from './styles'

const basisStyle = (basis: string | keyof typeof BASIS) => (
    `flex-basis: ${BASIS[basis] || basis}`
)

type directionT = 'column' | 'row'

const directionStyle = (direction: directionT) => {
    return css`
        min-width: 0;
        min-height: 0;
        flex-direction: ${direction};
    `
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
        return css`
            width: 100 %;
            height: 100 %;
        `
    }
    return undefined
}

const justifyStyle = (justify: keyof typeof JUSTIFY) => (
    css`justify-content: ${JUSTIFY[justify]};`
)

const WRAP_MAP = {
    reverse: 'wrap-reverse',
}

type WrapT = boolean | keyof typeof WRAP_MAP

const wrapStyle = (wrap: WrapT) => {
    if (typeof wrap === 'boolean') {
        return wrap ? css`flex-wrap: wrap` : undefined
    }
    return css`flex-wrap: ${WRAP_MAP[wrap]}`
}

interface MinMaxI {
    max?: string
    min?: string
}

const widthStyle = (w: string | MinMaxI) => {
    if (typeof w === 'object') {
        const c: any = {}
        if (w.max) c.maxWidth = w.max
        if (w.min) c.minWidth = w.min
        return css(c)
    } else {
        return css`width: ${w}`
    }
}

const heightStyle = (w: string | MinMaxI) => {
    if (typeof w === 'object') {
        const c: any = {}
        if (w.max) c.maxHeight = w.max
        if (w.min) c.minHeight = w.min
        return css(c)
    } else {
        return css`height: ${w}`
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
    return css`
        > *:not(:last-child) { margin-right: ${size}; }
    `
}

export interface BoxProps extends GenericPropsI {
    align?: keyof typeof ALIGN_MAP
    alignContent?: keyof typeof ALIGN_CONTENT
    direction?: directionT
    flex?: FlexGrowT
    basis?: string | keyof typeof BASIS
    justify?: keyof typeof JUSTIFY
    gap?: boolean | SizeT
    height?: string | MinMaxI
    width?: string | MinMaxI
    fill?: boolean | 'horizontal' | 'vertical'
    wrap?: WrapT
    className?: string
    id?: string | number
    pad?: SizeT | Area
}

const DOM_PROPS = ['children', 'onClick', 'type', 'role', 'id', 'tabIndex']

// NOTE: basis must be after flex! Otherwise, flex overrides basis
export const Box = styled.div
    .withConfig({
        shouldForwardProp: (prop) => prop.startsWith('data') || DOM_PROPS.includes(prop),
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
    ${props => props.pad && css(edgeStyle('padding', props.pad))}

    ${props => css(genericStyles(props))}
`
