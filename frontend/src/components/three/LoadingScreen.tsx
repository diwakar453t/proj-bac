import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function LoadingScreen({ onDone }: { onDone: () => void }) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(200, 200);
        renderer.setPixelRatio(2);
        mount.appendChild(renderer.domElement);

        // Spinning torus knot (DNA helix feel)
        const geo = new THREE.TorusKnotGeometry(0.8, 0.22, 120, 16);
        const mat = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.85,
        });
        const knot = new THREE.Mesh(geo, mat);
        scene.add(knot);

        // Orbiting sphere
        const sGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const sMat = new THREE.MeshBasicMaterial({ color: 0x5eead4 });
        const orb = new THREE.Mesh(sGeo, sMat);
        scene.add(orb);

        let frame: number;
        const clock = new THREE.Clock();

        const animate = () => {
            frame = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            knot.rotation.x = t * 0.6;
            knot.rotation.y = t * 0.4;
            orb.position.set(Math.cos(t * 2) * 1.4, Math.sin(t * 2) * 1.4, 0);
            renderer.render(scene, camera);
        };
        animate();

        // Auto dismiss after 2.2s
        const timer = setTimeout(() => {
            onDone();
        }, 2200);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(frame);
            renderer.dispose();
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, [onDone]);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0d1a]">
            {/* Three.js canvas */}
            <div ref={mountRef} className="w-[200px] h-[200px]" />
            {/* Brand */}
            <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                        <path d="M12 2a5 5 0 0 1 5 5c0 1.5-.67 2.84-1.72 3.78A6.002 6.002 0 0 1 18 16.5V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2.5a6.002 6.002 0 0 1 2.72-5.72A5 5 0 0 1 12 2z" />
                    </svg>
                </div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                    Mind Matrix
                </span>
            </div>
            {/* Progress bar */}
            <div className="mt-8 w-48 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                    style={{ animation: 'grow 2.1s ease-in-out forwards' }}
                />
            </div>
            <p className="mt-3 text-sm text-white/40 font-medium tracking-widest uppercase">
                Initialising AI...
            </p>
            <style>{`
        @keyframes grow {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
        </div>
    );
}
