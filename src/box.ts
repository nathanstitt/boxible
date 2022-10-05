import styled, { CSSObject } from '@emotion/styled'
import type { Property } from 'csstype'

import {
    edgeStyle, overflowStyle, genericStyles,
    GenericProps, Area, Size, Side, ScreenSizeNames,
    SIZES, SCREEN_SIZES, ALIGN_MAP, ALIGN_CONTENT_MAP, BASIS, JUSTIFY_MAP, FLEX,
} from './styles'

const basisStyle = (basis: string | number | keyof typeof BASIS) => (
    `flex-basis: ${BASIS[basis] || basis};`
)

type Direction = 'column' | 'row' | 'column-reverse' | 'row-reverse'

const directionStyle = (direction: Direction) => `
    min-width: 0;
    min-height: 0;
    flex-direction: ${direction};
`

const DIRECTION_MAP: Record<string, string> = {
    column: directionStyle('column'),
    row: directionStyle('row'),
    columnReverse: directionStyle('column-reverse'),
    rowReverse: directionStyle('row-reverse'),
}


interface FlexGrowShrinkI {
    grow?: number
    shrink?: number
    basis?: string | number | keyof typeof BASIS
}

type FlexGrowT = boolean | keyof typeof FLEX | FlexGrowShrinkI

const flexStyle = (flex: FlexGrowT, basis?: string | number | keyof typeof BASIS) => {
    let flexStyle = ''
    if (typeof flex === 'boolean') {
        flexStyle = '1 1' // function won't be called if flex is false (but why use Box if you don't want flex?)
    }
    if (typeof flex == 'object') {
        flexStyle = `${flex.grow} ${flex.shrink}`
        if (flex.basis && !basis) {
            basis = flex.basis
        }
    }
    if (typeof flex == 'string') {
        flexStyle = FLEX[flex]
    }

    const basisStyleDef = basis ? `${BASIS[basis] || basis}` : 'auto'

    return `flex: ${flexStyle} ${basisStyleDef}; `
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

type Indexable = string | number | symbol | any

function responsiveStyle<T extends object>(
    prop: keyof T | Partial<Record<ScreenSizeNames, keyof T>>,
    cssName: string | ((s: Indexable) => string | CSSObject),
    map: T,
) {
    let styles = ''
    const toStyle = typeof cssName == 'function' ? cssName :
        (key: Indexable) => cssName ? `${cssName}: ${map[key]};` : map[key]
    if (typeof prop === 'object') {
        for (const [sz, key] of Object.entries(prop)) {
            styles += `@media(${SCREEN_SIZES[sz]}) { ${toStyle(key)}; } `
        }
        return styles
    }
    return toStyle(prop)
}

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
        return `width: ${w}; `
    }
}

const heightStyle = (w: string | MinMax) => {
    if (typeof w === 'object') {
        const c: any = {}
        if (w.max) c.maxHeight = w.max
        if (w.min) c.minHeight = w.min
        return c
    } else {
        return `height: ${w}; `
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
    align?: keyof typeof ALIGN_MAP | Partial<Record<ScreenSizeNames, keyof typeof ALIGN_MAP>>,
    alignContent?: keyof typeof ALIGN_CONTENT_MAP | Partial<Record<ScreenSizeNames, keyof typeof ALIGN_CONTENT_MAP>>,
    direction?: keyof typeof DIRECTION_MAP | Partial<Record<ScreenSizeNames, keyof typeof DIRECTION_MAP>>,
    justify?: keyof typeof JUSTIFY_MAP | Partial<Record<ScreenSizeNames, keyof typeof JUSTIFY_MAP>>,
    flex?: FlexGrowT
    basis?: string | number | keyof typeof BASIS
    gap?: boolean | Size
    height?: string | MinMax
    width?: string | MinMax
    fill?: boolean | 'horizontal' | 'vertical'
    wrap?: WrapT
    className?: string
    pad?: Size | Area | Side

}

const OWN_PROPS = [
    'basis', 'align', 'alignContent', 'direction', 'overflowProp', 'flex', 'justify', 'as',
    'gap', 'height', 'width', 'fill', 'wrap', 'margin', 'pad', 'padding', 'alignSelf', 'gridArea',
]

// NOTE: basis must be after flex! Otherwise, flex overrides basis
const buildBox = () => styled('div', {
    shouldForwardProp: (prop) => !OWN_PROPS.includes(prop as string)
}) <BoxProps>`
    display: flex;
    box-sizing: border-box;
    outline: none;
    ${({ align }) => align && responsiveStyle(align, 'align-items', ALIGN_MAP)}
    ${({ alignContent }) => alignContent && responsiveStyle(alignContent, 'align-content', ALIGN_CONTENT_MAP)}
    ${({ direction }) => direction && responsiveStyle(direction, '', DIRECTION_MAP)}
    ${({ justify }) => justify && responsiveStyle(justify, 'justify-content', JUSTIFY_MAP)}
    ${(props: any) => props.overflowProp && overflowStyle(props.overflowProp)}
    ${({ flex, basis }) => flex && flexStyle(flex, basis)}
    ${({ flex, basis }) => !flex && basis && basisStyle(basis)}
    ${({ gap }: any) => gap && gapStyle(gap)}
    ${({ height }) => height && heightStyle(height)}
    ${({ width }) => width && widthStyle(width)}
    ${({ fill }) => fill && fillStyle(fill)}
    ${({ wrap }) => wrap && wrapStyle(wrap)}
    ${({ pad }) => pad && edgeStyle('padding', pad)}
    ${props => genericStyles(props)}
`
const box: any = buildBox()
box.screenSizes = SCREEN_SIZES

type BoxT = ReturnType<typeof buildBox> & {
    screenSizes: Record<ScreenSizeNames, number>
}

const Box = box as BoxT

export { Box }
