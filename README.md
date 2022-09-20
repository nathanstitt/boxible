![Build Status](https://github.com/nathanstitt/boxible/actions/workflows/checks.yml/badge.svg)

## make flexbox containers in typescript using emotion

Uses emotionjs to style a div using flexbox styles. React components can easily set any flexbox style using component properties. Typescript gives you nice code completion and type-safe validations.

Full docs are published at [https://nathanstitt.github.io/boxible/](https://nathanstitt.github.io/boxible/)

```jsx
import { Box } from "boxible";

const Layout = () => (
  <Box direction={{ mobile: "columReverse", tablet: "column" }}>
    <Box justify="between">
      <Box align="start">Left</Box>
      <Box align="end" direction="column">
        <span>Right Top</span>
        <span>Right Center</span>
      </Box>
    </Box>
    <Box justify="center">Bottom Center</Box>
  </Box>
);
```

On a desktop sized (>992px), the display will be:

```
 Left                   Right Top
                     Right Center
        Bottom Center
```

And on a mobile sized device (<=576px) the display would be:

```jsx
        Bottom Center
                     Right Center

Left Right Top
```

Screen sizes are defined as `SCREEN_SIZES` in [styles.ts](src/styles.ts#L18)

Their definitions can be overridden as detailed in the hacking sizes [test.ts](src/box.test.tsx#L46)

### Boxible Props

| property     | allowed values                               | default |
| ------------ | -------------------------------------------- | ------- |
| align        | baseline, center, end, start, stretch        |         |
| alignContent | around, between, center, end, start, stretch |         |
| direction    | column, row                                  | row     |
| justify      | around, between, center, end, evenly, start  |         |
| flex         | true, false, grow, shrink                    |         |
| basis        | string value, auto, full, 1/2, 1/4, 1/3, 2/3 |         |
| gap          | boolean                                      | false   |
| height       | string,( min, max )                          |         |
| width        | string, ( min, max )                         |         |
| fill         | boolean, 'horizontal', 'vertical'            |         |
| wrap         | boolean                                      | false   |
| className    | string                                       |         |
| pad          | px value, small, medium, large, xxlarge      | Size    |
| margin       | px value, small, medium, large, xxlarge      | Size    |

align, alignContent, direction, and justify are "responsive" and can alternatively be prefixed with a size

Since the Box element is a emotionjs component, you can also use the "as" prop to render elements other than div, such
as `label` to wrap inputs.

```jsx
<Box as="label">
  <input name="foo" />
  <b>Click to focus input</b>
</Box>
```

#### Credits

Boxible is based loosely on Grommt’s [Box component](https://v2.grommet.io/box), but re-written in Typescript
and with a few differences, such as no animation support.
