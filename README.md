![Build Status](https://github.com/nathanstitt/boxible/actions/workflows/checks.yml/badge.svg)

## make flexbox containers in typescript using emotion

Uses emotionjs to style a div using flexbox styles.  React components can easily set any flexbox style using component properties.  Typescript gives you nice code completion and type-safe validations.

Full docs are published at [https://nathanstitt.github.io/boxible/](https://nathanstitt.github.io/boxible/)
```jsx

import { Box } from 'boxible'

<Box align="between" grow>
  <Box align="middle">Left</Box>
  <Box box direction="column>
    <Box align="end>Right Top</Box>
    <div>Right Middle Content</div>
    <div>Right Bottom</div>
  </Box>
</Box>
```
<pre>
-----------------------------------
|                        Right Top |
|    Left     Right Middle Content |
|             Right Bottom         |
-----------------------------------
</pre>


###  Boxible Props

|property| allowed values | default |
|--|--|--|
|  align |  baseline, center, end, start, stretch | |
| alignContent | around, between, center, end, start, stretch | |
| direction | column, row | row |
| flex | true, false, grow, shrink |
| basis | string value, auto, full, 1/2, 1/4, 1/3, 2/3 | |
|  justify | around, between, center, end, evenly, start | |
| gap | boolean | false |
| height | string, { min, max} | |
| width | string, { min, max } | |
| fill | boolean, 'horizontal', 'vertical' | |
| wrap | boolean | false |
| className | string | |
| pad | Size | Area | Side |  |
| margin | | Size | Area | Side |  |



Since the Box element is a emotionjs component, you can also use the "as" prop to render elements other than div, such
as `label` to wrap inputs.

```
<Box as="label">
   <input name="foo" />
   <b>Click to focus input</b>
</Box>
```

<pre>
-----------
|         |  click to focus input
-----------
</pre>


#### Credits

Boxible is based loosely on Grommt’s [Box component](https://v2.grommet.io/box), but re-written in Typescript
and with a few differences, such as no animation support.
