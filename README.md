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
