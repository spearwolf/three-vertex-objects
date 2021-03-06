import {Material, Mesh} from 'three';

import {InstancedVertexObjectGeometry} from './InstancedVertexObjectGeometry';

import {VertexObjectGeometry} from './VertexObjectGeometry';

/**
 * @category Vertex Objects
 */
export interface VertexObjects {
  geometry: VertexObjectGeometry | InstancedVertexObjectGeometry;
}

/**
 * @category Vertex Objects
 */
export class VertexObjects extends Mesh {
  constructor(geometry?: VertexObjectGeometry | InstancedVertexObjectGeometry, material?: Material | Material[]) {
    super(geometry, material);
    this.name = 'VertexObjects';
  }

  onBeforeRender = (): void => {
    this.geometry?.update();
  };
}
