import styled, { CSSObject } from '@emotion/styled'
import type { Property } from 'csstype'

import {
    overflowStyle, genericStyles,
    GenericProps, ScreenSizeNames, Size,
    SIZES, SCREEN_SIZES, ALIGN_MAP, ALIGN_SELF_MAP, ALIGN_CONTENT_MAP, BASIS, JUSTIFY_MAP, FLEX,
} from './styles'

const basisStyle = (basis: string | number | keyof typeof BASIS) => (
    `flex-basis: ${BASIS[basis] || basis};`
)

type Direction = 'column' | 'row' | 'column-reverse' | 'row-reverse'

const directionStyle = (direction: Direction) => `
    ${direction.startsWith('col') ? 'min-width: 0; min-height: 0;' : ''}
    flex-direction: ${direction};
`

const DIRECTION_MAP: Record<string, string> = {
    column: directionStyle('column'),
    row: directionStyle('row'),
    columnReverse: directionStyle('column-reverse'),
    rowReverse: directionStyle('row-reverse'),
}


interface FlexGrowShrinkI {
    grow?: number | false
    shrink?: number | false
    basis?: string | number | keyof typeof BASIS
}

type FlexGrowT = boolean | keyof typeof FLEX | FlexGrowShrinkI

const flexStyle = (flex: FlexGrowT, basis?: string | number | keyof typeof BASIS) => {
    let flexStyle = ''
    if (typeof flex === 'boolean') {
        flexStyle = '1 1' // function won't be called if flex is false (but why use Box if you don't want flex?)
    }
    if (typeof flex == 'object') {
        const shrink = flex.shrink == null ? 1 : flex.shrink || 0;
        const grow = flex.grow == null ? 1 : flex.grow || 0;
        flexStyle = `${grow} ${shrink}`
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
        (key: Indexable) => cssName ? `${cssName}: ${map[key] || (typeof key == 'number' ? `${key}px` : key) };` : map[key]
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

const widthStyle = (w: string | number | MinMax) => {
    if (typeof w === 'object') {
        const c: any = {}
        if (w.max) c.maxWidth = w.max
        if (w.min) c.minWidth = w.min
        return c
    } else {
        return `width: ${w}; `
    }
}

const heightStyle = (w: string | number | MinMax) => {
    if (typeof w === 'object') {
        const c: any = {}
        if (w.max) c.maxHeight = w.max
        if (w.min) c.minHeight = w.min
        return c
    } else {
        return `height: ${w}; `
    }
}

const GAP_MAP = {
    ...SIZES,
    'true': SIZES.default,
    'false': 0
}

export interface BoxProps extends GenericProps {
    align?: keyof typeof ALIGN_MAP | Partial<Record<ScreenSizeNames, keyof typeof ALIGN_MAP>>,
    justify?: keyof typeof JUSTIFY_MAP | Partial<Record<ScreenSizeNames, keyof typeof JUSTIFY_MAP>>,
    alignSelf?: keyof typeof ALIGN_SELF_MAP | Partial<Record<ScreenSizeNames, keyof typeof ALIGN_SELF_MAP>>,
    justifySelf?: keyof typeof ALIGN_SELF_MAP | Partial<Record<ScreenSizeNames, keyof typeof ALIGN_SELF_MAP>>,
    alignContent?: keyof typeof ALIGN_CONTENT_MAP | Partial<Record<ScreenSizeNames, keyof typeof ALIGN_CONTENT_MAP>>,
    direction?: keyof typeof DIRECTION_MAP | Partial<Record<ScreenSizeNames, keyof typeof DIRECTION_MAP>>,
    flex?: FlexGrowT
    basis?: string | number | keyof typeof BASIS
    gap?: boolean | number | Size | Partial<Record<ScreenSizeNames, Size | number>>,
    height?: string | number | MinMax
    width?: string | number | MinMax
    fill?: boolean | 'horizontal' | 'vertical'
    wrap?: WrapT
    centered?: boolean
    className?: string
    gridArea?: string
}

export const boxiblePropNames = [
    'basis', 'align', 'alignContent', 'direction', 'overflowProp', 'flex', 'justify', 'as', 'centered',
    'gap', 'height', 'width', 'fill', 'wrap', 'margin', 'pad', 'padding', 'alignSelf', 'gridArea'
]

const CONSUMED_PROPS = boxiblePropNames.concat([
    'className'
])

export function extractBoxibleProps<T extends object = {}>(props: T & BoxProps) {
    const boxProps: Partial<BoxProps> = {}
    const rest: Partial<T> = {}
    for (const key in props) {
        if (CONSUMED_PROPS.includes(key)) {
            boxProps[key] = props[key]
        } else {
            rest[key] = props[key]
        }
    }
    return [boxProps, rest] as [Partial<BoxProps>, Partial<T>]
}

// NOTE: basis must be after flex! Otherwise, flex overrides basis
const buildBox = () => styled('div', {
    shouldForwardProp: (prop) => !boxiblePropNames.includes(prop as string)
}) <BoxProps>`
    display: flex;
    box-sizing: border-box;
    outline: none;
    ${({ centered }) => centered && 'align-items: center; justify-content: center;'}
    ${({ align }) => align && responsiveStyle(align, 'align-items', ALIGN_MAP)}
    ${({ alignSelf }) => alignSelf && responsiveStyle(alignSelf, 'align-self', ALIGN_SELF_MAP)}
    ${({ justifySelf }) => justifySelf && responsiveStyle(justifySelf, 'justify-self', ALIGN_SELF_MAP)}
    ${({ alignContent }) => alignContent && responsiveStyle(alignContent, 'align-content', ALIGN_CONTENT_MAP)}
    ${({ direction }) => direction && responsiveStyle(direction, '', DIRECTION_MAP)}
    ${({ justify }) => justify && responsiveStyle(justify, 'justify-content', JUSTIFY_MAP)}
    ${(props: any) => props.overflowProp && overflowStyle(props.overflowProp)}
    ${({ flex, basis }) => flex && flexStyle(flex, basis)}
    ${({ flex, basis }) => !flex && basis && basisStyle(basis)}
    ${({ gap }: any) => gap && responsiveStyle(gap, 'gap', GAP_MAP)}
    ${({ height }) => height && heightStyle(height)}
    ${({ width }) => width && widthStyle(width)}
    ${({ fill }) => fill && fillStyle(fill)}
    ${({ wrap }) => wrap && wrapStyle(wrap)}
    ${({ gridArea }) => gridArea ? `grid-area: ${gridArea};` : ''}
    ${props => genericStyles(props)}
`
const box: any = buildBox()
box.screenSizes = SCREEN_SIZES

type BoxT = ReturnType<typeof buildBox> & {
    screenSizes: Record<ScreenSizeNames, number>
}

const Box = box as BoxT

export { Box }
