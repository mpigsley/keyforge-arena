import React, { useRef, useEffect } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three';

import { useAnimation } from 'utils/custom-effects';

import styles from './styles.module.scss';

export default function GameBoard() {
  const canvasRef = useRef(null);

  let cube;
  let renderer;
  let scene;
  let camera;

  useEffect(() => {
    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    scene = new Scene();
    camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
    renderer = new WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current,
    });
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({
      color: '#ff0000',
      wireframe: true,
    });
    cube = new Mesh(geometry, material);

    camera.position.z = 4;
    scene.add(cube);
    renderer.setSize(width, height);
  }, []);

  useAnimation(() => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  });

  return (
    <canvas
      className={styles.canvas}
      height={window.innerHeight}
      width={window.innerWidth}
      ref={canvasRef}
    />
  );
}
