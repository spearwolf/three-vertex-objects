# **picimo**

Welcome to *picimo* &mdash; the *sprite* :space_invader::joystick: engine on top of [three.js]() + [react]() &#8658; [react-three-fiber](https://github.com/pmndrs/react-three-fiber)!

> *pic&mdash;i&ndash;mo* is an acronym for _**pictures in motion**_

The idea is roughly the following:

```jsx
export default () => {
  const geometry = useRef();
  const textureAtlas = useTextureAtlas("foo-atlas");

  useFrameStateMachine(
    {
      init({ geometry, textureAtlas, state, delta }) {
        // your code goes here
      },

      update({ geometry: { current, previous }, textureAtlas.. }) {
        // your code goes here
      },

      frame({ geometry, textureAtlas, state, delta }) {
        // your code goes here
      },

      dispose({ geometry, textureAtlas }) {
        // your code goes here
      },
    },
    { geometry: forwardRefValue(geometry), textureAtlas }
  );

  return (
    <Stage2D renderToTexture="stage0">
      <ParallaxProjection
        attach="projection"
        width="640"
        height="480"
        fit="contain"
      />

      <TextureAtlas name="foo-atlas" url="foo-atlas.json" />

      <TexturedSprites>
        <TexturedSpritesGeometry ref={geometry} />
        <TexturedSpritesMaterial>
          <TextureRef name="foo-atlas" attach="colorMap" />
        </TexturedSpritesMaterial>
      </TexturedSprites>
    </Stage2D>
  );
};
```

have fun!

:rocket: