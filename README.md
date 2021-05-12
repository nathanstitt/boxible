## make flexbox containers in typescript using styled-components 

Uses styled-components to style a div using flexbox styles.  React components can easily set any flexbox style using component properties.  Typescript gives you nice code completion and prop validation.

Full docs are published at [https://nathanstitt.github.io/boxible/](https://nathanstitt.github.io/boxible/)
```jsx

import { Box } from 'boxible'

<Box align="between" grow>
  <Box align="middle">Left</Box>
  <Box>
    <Box align="end>Right Top</Box>
    <div>Right Middle Content</div>
    <divRight Bottom</div>
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


#### Credits

FlexyBox is based loosely on Grommt’s [Box component](https://v2.grommet.io/box), but re-written in Typescript
and with a few differences, such as no animation support.
