import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function NeuralBrainCanvas() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const W = mount.clientWidth;
        const H = mount.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // ── Nodes ──────────────────────────────────────────────
        const NODE_COUNT = 80;
        const nodePositions: THREE.Vector3[] = [];
        const nodeMeshes: THREE.Mesh[] = [];

        const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
        const colors = [0x8b5cf6, 0x6366f1, 0xa78bfa, 0x5eead4, 0x818cf8];

        for (let i = 0; i < NODE_COUNT; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 3
            );
            nodePositions.push(pos);

            const mat = new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                transparent: true,
                opacity: 0.85,
            });
            const mesh = new THREE.Mesh(nodeGeo, mat);
            mesh.position.copy(pos);
            scene.add(mesh);
            nodeMeshes.push(mesh);
        }

        // ── Edges ──────────────────────────────────────────────
        const MAX_DIST = 2.0;
        const edgeGroup = new THREE.Group();
        scene.add(edgeGroup);

        for (let i = 0; i < NODE_COUNT; i++) {
            for (let j = i + 1; j < NODE_COUNT; j++) {
                const dist = nodePositions[i].distanceTo(nodePositions[j]);
                if (dist < MAX_DIST) {
                    const opacity = 1 - dist / MAX_DIST;
                    const geo = new THREE.BufferGeometry().setFromPoints([
                        nodePositions[i],
                        nodePositions[j],
                    ]);
                    const mat = new THREE.LineBasicMaterial({
                        color: 0x8b5cf6,
                        transparent: true,
                        opacity: opacity * 0.4,
                    });
                    edgeGroup.add(new THREE.Line(geo, mat));
                }
            }
        }

        // ── Floating particles ──────────────────────────────────
        const particleCount = 120;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            pPos[i] = (Math.random() - 0.5) * 10;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.03, transparent: true, opacity: 0.5 });
        scene.add(new THREE.Points(pGeo, pMat));

        // ── Pulse rings ─────────────────────────────────────────
        const rings: { mesh: THREE.Mesh; speed: number; maxScale: number }[] = [];
        for (let i = 0; i < 3; i++) {
            const rGeo = new THREE.RingGeometry(0.2, 0.22, 32);
            const rMat = new THREE.MeshBasicMaterial({
                color: 0x8b5cf6, side: THREE.DoubleSide, transparent: true, opacity: 0.3,
            });
            const ring = new THREE.Mesh(rGeo, rMat);
            ring.position.set(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5)
            );
            ring.rotation.x = Math.random() * Math.PI;
            scene.add(ring);
            rings.push({ mesh: ring, speed: 0.3 + Math.random() * 0.4, maxScale: 4 + Math.random() * 4 });
        }

        // ── Node velocities (drift) ──────────────────────────────
        const velocities = nodePositions.map(() =>
            new THREE.Vector3(
                (Math.random() - 0.5) * 0.003,
                (Math.random() - 0.5) * 0.003,
                (Math.random() - 0.5) * 0.001
            )
        );

        let frame: number;
        const clock = new THREE.Clock();

        const animate = () => {
            frame = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // Rotate whole scene gently
            scene.rotation.y = t * 0.06;
            scene.rotation.x = Math.sin(t * 0.04) * 0.12;

            // Drift nodes
            nodeMeshes.forEach((mesh, i) => {
                mesh.position.addScaledVector(velocities[i], 1);
                if (Math.abs(mesh.position.x) > 3.5) velocities[i].x *= -1;
                if (Math.abs(mesh.position.y) > 3.5) velocities[i].y *= -1;
                // Pulse size
                const s = 1 + 0.3 * Math.sin(t * 2 + i);
                mesh.scale.setScalar(s);
            });

            // Pulse rings
            rings.forEach((r) => {
                r.mesh.scale.addScalar(r.speed * 0.01);
                (r.mesh.material as THREE.MeshBasicMaterial).opacity =
                    0.4 * (1 - r.mesh.scale.x / r.maxScale);
                if (r.mesh.scale.x > r.maxScale) r.mesh.scale.setScalar(1);
            });

            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const onResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
}
