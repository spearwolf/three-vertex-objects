jest.mock('scheduler', () => require('scheduler/unstable_mock'));

import '@react-three/fiber';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import {useRef} from 'react';
import {Mesh} from 'three';

import {useFrameStateMachine, forwardRefValue} from './useFrameStateMachine';

// TODO test useFrameStateMachine(callbacks, /* without-extra-params */)

const TestMesh = ({callbacks}: any) => {
  const meshRef = useRef<Mesh>();

  useFrameStateMachine(callbacks, {mesh: forwardRefValue(meshRef)});

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={0xffff00} />
    </mesh>
  );
};

const TestScene = ({showMesh, callbacks}: any) => <>{showMesh && <TestMesh callbacks={callbacks} />}</>;

describe('useFrameStateMachine hook', () => {
  test('hook function exists', () => {
    expect(typeof useFrameStateMachine).toBe('function');
  });

  test('init() callback', async () => {
    const callbacks = {
      init: jest.fn(),
      frame: jest.fn(),
      dispose: jest.fn(),
    };

    const renderer = await ReactThreeTestRenderer.create(<TestScene showMesh callbacks={callbacks} />);
    const mesh = renderer.scene.findByType('Mesh').instance;

    expect(mesh).toBeDefined();
    expect(mesh.type).toBe('Mesh');

    expect(callbacks.init).not.toBeCalled();
    expect(callbacks.frame).not.toBeCalled();
    expect(callbacks.dispose).not.toBeCalled();

    await ReactThreeTestRenderer.act(async () => {
      renderer.advanceFrames(1, 1);
    });

    expect(callbacks.init).toBeCalledTimes(1);
    expect(callbacks.frame).not.toBeCalled();
    expect(callbacks.dispose).not.toBeCalled();

    let args = callbacks.init.mock.calls[0][0];
    expect(args.mesh).toBe(mesh);
    expect(args.state).toBeDefined();
    expect(args.delta).toBe(1);

    await ReactThreeTestRenderer.act(async () => {
      renderer.advanceFrames(5, 2);
    });

    expect(callbacks.init).toBeCalledTimes(1);
    expect(callbacks.frame).toBeCalledTimes(5);
    expect(callbacks.dispose).not.toBeCalled();

    args = callbacks.frame.mock.calls.at(-1)[0];
    expect(args.mesh).toBe(mesh);
    expect(args.state).toBeDefined();
    expect(args.delta).toBe(2);

    await renderer.update(<TestScene callbacks={callbacks} />);

    expect(callbacks.init).toBeCalledTimes(1);
    expect(callbacks.frame).toBeCalledTimes(5);
    expect(callbacks.dispose).toBeCalledTimes(1);

    args = callbacks.dispose.mock.calls.at(-1)[0];
    expect(args.mesh).toBe(mesh);
    expect(args.state).toBeUndefined();
    expect(args.delta).toBeUndefined();

    renderer.unmount();
  });
});