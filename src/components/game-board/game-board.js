import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

import { useAnimation } from 'utils/custom-effects';

import styles from './styles.module.scss';

const CARD_IMG =
  'https://firebasestorage.googleapis.com/v0/b/keyforge-arena.appspot.com/o/cota%2F010.png?alt=media&token=5652b7f4-b873-4e5a-8b3b-9fae6e8fdea6';

export default function GameBoard() {
  const canvasRef = useRef(null);

  let cube;
  let renderer;
  let scene;
  let camera;

  useEffect(() => {
    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current,
    });
    const geometry = new THREE.BoxGeometry(10, 10, 1);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(CARD_IMG);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });

    cube = new THREE.Mesh(geometry, material);

    camera.position.z = 4;
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xcccccc);
    scene.add(directionalLight);

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
