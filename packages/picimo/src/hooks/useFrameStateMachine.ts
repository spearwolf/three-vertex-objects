import {RootState, useFrame} from '@react-three/fiber';
import {useCallback, useLayoutEffect, useMemo, useRef, useState, MutableRefObject} from 'react';

const sortedKeys = (obj: any) => Object.keys(obj).sort();

const forwardRefValues = new WeakSet<MutableRefObject<any>>();

export const forwardRefValue = (ref: MutableRefObject<any>) => {
  forwardRefValues.add(ref);
  return ref;
};

const isForwardRefValue = (ref: any): ref is MutableRefObject<any> => forwardRefValues.has(ref);

type FrameStateMachineParams = Record<string, unknown>;
type NonNullParams<Params extends FrameStateMachineParams> = {[Key in keyof Params]: NonNullable<Params[Key]>};
type ParamChanges<Params extends FrameStateMachineParams> = {
  [Key in keyof Params]: {currentValue: Params[Key]; previousValue: Params[Key]};
};

interface UseFrameParams {
  state: RootState;
  delta: number;
}

type FrameStateMachineInitArgs<Params extends FrameStateMachineParams> = Omit<NonNullParams<Params>, keyof UseFrameParams> &
  UseFrameParams;

type FrameStateMachineFrameArgs<Params extends FrameStateMachineParams> = Params & UseFrameParams;

interface FrameStateMachineCallbacks<Params extends FrameStateMachineParams> {
  init?: (args: FrameStateMachineInitArgs<Params>) => void;
  update?: (changes: ParamChanges<Params>) => void;
  frame: (args: FrameStateMachineFrameArgs<Params>) => void;
  dispose?: (args: Params) => void;
}

interface FrameStateMachineLazyCallbacks<Params extends FrameStateMachineParams> {
  (args: FrameStateMachineInitArgs<Params>): FrameStateMachineCallbacksWithRenderPriority<Params>;
  renderPriority?: number;
}

interface FrameStateMachineCallbacksWithRenderPriority<Params extends FrameStateMachineParams>
  extends FrameStateMachineCallbacks<Params> {
  renderPriority?: number;
}

const constructArgs = <Params extends FrameStateMachineParams>(args: Params): NonNullParams<Params> =>
  Object.fromEntries(
    Object.entries(args).map(([key, value]) => [key, isForwardRefValue(value) ? value.current : value]),
  ) as NonNullParams<Params>;

const isLazyCallbacks = <Params extends FrameStateMachineParams>(
  callbacks: FrameStateMachineCallbacksWithRenderPriority<Params> | FrameStateMachineLazyCallbacks<Params>,
): callbacks is FrameStateMachineLazyCallbacks<Params> => typeof callbacks === 'function';

const getChanges = <Params extends FrameStateMachineParams>(
  args: Params,
  lastArgs: Params,
): [hasChanges: boolean, changes: ParamChanges<Params>] => {
  const changes = Object.entries(args).filter(([key, val]) => val !== lastArgs[key]);
  const hasChanges = changes.length > 0;
  return [
    hasChanges,
    hasChanges
      ? (Object.fromEntries(
          changes.map(([key, currentValue]) => [key, {currentValue, previousValue: lastArgs[key]}]),
        ) as any as ParamChanges<Params>)
      : undefined,
  ];
};

export const useFrameStateMachine = <Params extends FrameStateMachineParams>(
  callbacks: FrameStateMachineCallbacksWithRenderPriority<Params> | FrameStateMachineLazyCallbacks<Params>,
  dependencies: Params = {} as Params,
): MutableRefObject<FrameStateMachineCallbacks<Params>> => {
  // TODO just use only 1x useRef here
  const callbacksRef = useRef(callbacks);
  const stateMachineRef = useRef<FrameStateMachineCallbacks<Params>>(undefined);
  const dependenciesRef = useRef(dependencies);
  const lastArgs = useRef<Record<string, any>>();

  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect((): void => {
    if (isInitialized && !isLazyCallbacks(callbacks)) {
      stateMachineRef.current = callbacks;
    } else {
      callbacksRef.current = callbacks;
    }
  }, [callbacks, isInitialized]);

  useLayoutEffect((): void => void (dependenciesRef.current = dependencies), [dependencies]);

  const sortedDepKeys = useMemo(() => sortedKeys(dependencies), []);
  const depValues = sortedDepKeys.map((key) => dependencies[key]);

  const onFrame = useCallback(
    (state: RootState, delta: number) => {
      const args = constructArgs(dependenciesRef.current);
      // all settled is when all values are truthy
      const argsAllSettled = Object.entries(args).every(([, dep]) => Boolean(dep));
      const methodArgs = {...args, state, delta};
      if (isInitialized) {
        if (stateMachineRef.current?.update) {
          const [hasChanges, changes] = getChanges(args as Params, lastArgs.current as Params);
          if (hasChanges) {
            stateMachineRef.current.update(changes);
          }
        }

        lastArgs.current = args;

        if (stateMachineRef.current?.frame) {
          stateMachineRef.current.frame(methodArgs);
        }
      } else if (argsAllSettled) {
        stateMachineRef.current = isLazyCallbacks(callbacksRef.current) ? callbacksRef.current(methodArgs) : callbacksRef.current;

        if (stateMachineRef.current?.init) {
          stateMachineRef.current.init(methodArgs);
        }

        lastArgs.current = args;

        setIsInitialized(true);
      }
    },
    [isInitialized, ...depValues],
  );

  useLayoutEffect(
    () => () => {
      if (stateMachineRef.current?.dispose) {
        stateMachineRef.current.dispose(constructArgs(dependenciesRef.current));
      }
    },
    [],
  );

  useFrame(onFrame, callbacks.renderPriority ?? 0);

  return stateMachineRef;
};
