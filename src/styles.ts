import { css, CSSObject, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'
import { capitalize } from './util'

export const SIZES = {
    small: '.2rem',
    default: '.5rem',
    medium: '.8rem',
    large: '1rem',
}
export type edgeKindT = "margin" | "border" | "padding"
export type sizesT = keyof typeof SIZES

export const  ALIGN_CONTENT = {
    around: 'around',
    between: 'between',
    center: 'center',
    end: 'flex-end',
    start: 'flex-start',
    stretch: 'stretch',
}

export const BASIS = {
    auto: 'auto',
    full: '100%',
    '1/2': '50%',
    '1/4': '25%',
    '2/4': '50%',
    '3/4': '75%',
    '1/3': '33.33%',
    '2/3': '66.66%',
}

export const JUSTIFY = {
    around: 'space-around',
    between: 'space-between',
    center: 'center',
    end: 'flex-end',
    evenly: 'space-evenly',
    start: 'flex-start',
}


export const FLEX = {
    grow: '1 0',
    shrink: '0 1',
}

export interface Area {
    horizontal?: sizesT | string
    vertical?: sizesT | string
    top?: sizesT | string
    bottom?: sizesT | string
    left?: sizesT | string
    right?: sizesT | string
}

export type AreaKey = keyof Area

export const ALIGN_SELF_MAP = {
    center: 'center',
    end: 'flex-end',
    start: 'flex-start',
    stretch: 'stretch',
}

export const ALIGN_MAP = {
    baseline: 'baseline',
    center: 'center',
    end: 'flex-end',
    start: 'flex-start',
    stretch: 'stretch',
}

export type SizeT = keyof typeof SIZES

export interface GenericPropsI {
    alignSelf?: keyof typeof ALIGN_SELF_MAP
    gridArea?: string
    margin?: SizeT | Area
    padding?: SizeT | Area
}

export const genericStyles = (props: GenericPropsI & { theme: DefaultTheme }):CSSObject => {
    const styles: CSSObject = {}
    if (props.alignSelf) {
        styles['alignSelf'] = ALIGN_SELF_MAP[props.alignSelf]
    }
    if (props.gridArea) {
        styles['gridArea'] = props.gridArea
    }
    if (props.margin) {
        Object.assign(styles, edgeStyle('margin', props.margin))
    }
    if (props.padding) {
        Object.assign(styles, edgeStyle('padding', props.padding))
    }
    return styles
}


interface overflowI {
    horizontal?: boolean
    vertical?: boolean
}

export const overflowStyle = (overflowProp: string | overflowI): FlattenSimpleInterpolation => {
    if (typeof overflowProp === 'string') {
        return css`overflow: ${overflowProp};`
    }

    return css`
       ${overflowProp.horizontal && `overflow-x: ${overflowProp.horizontal};`}
       ${overflowProp.vertical && `overflow-y: ${overflowProp.vertical};`};
    `
}

export const edgeStyle = (
    kind: edgeKindT,
    data: string | sizesT | Area,
):CSSObject => {
    if (typeof data === 'string') {
        return { [kind]: SIZES[data] || data }
    }
    const styles: CSSObject = {}

    if (data.horizontal) {
        styles[`${kind}Right`] = styles[`${kind}-left`] = SIZES[data.horizontal] || data.horizontal
    }
    if (data.vertical) {
        styles[`${kind}Top`] = styles[`${kind}-bottom`] = SIZES[data.vertical] || data.vertical
    }

    ['top', 'right', 'bottom', 'left'].forEach(side => {
        const value = data[side]
        if (value) {
            styles[`${kind}${capitalize(side)}`] = SIZES[value] || value
        }
    })

    return styles
}
