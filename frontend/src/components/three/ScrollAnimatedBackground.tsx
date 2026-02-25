import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ScrollAnimatedBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // --- Setup Scene ---
        const W = window.innerWidth;
        const H = window.innerHeight;
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0d0d1a, 0.002);

        const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // --- Particles (Stars/Data Nodes) ---
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            // Spread them wide and deep
            posArray[i] = (Math.random() - 0.5) * 400;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Create a circular texture for particles programmatically
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.arc(32, 32, 28, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
        const texture = new THREE.CanvasTexture(canvas);

        const particlesMaterial = new THREE.PointsMaterial({
            size: 1.2,
            map: texture,
            transparent: true,
            opacity: 0.6,
            color: 0x8b5cf6, // Violet
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // --- Track Scroll ---
        let scrollY = window.scrollY;
        let targetCameraY = 0;
        let targetCameraZ = 100;

        const handleScroll = () => {
            scrollY = window.scrollY;
            // Map scroll to camera movement (flying forward/downward)
            targetCameraY = -(scrollY * 0.05);
            targetCameraZ = 100 - (scrollY * 0.08); // Move forward as we scroll down

            // Prevent flying past particles completely
            if (targetCameraZ < -50) targetCameraZ = -50;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // --- Animation Loop ---
        let frameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Slowly rotate the entire particle system
            particlesMesh.rotation.y = elapsedTime * 0.04;
            particlesMesh.rotation.x = elapsedTime * 0.02;

            // Smoothly interpolate camera position based on scroll
            camera.position.y += (targetCameraY - camera.position.y) * 0.05;
            camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

            renderer.render(scene, camera);
        };
        animate();

        // --- Handle Resize ---
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            texture.dispose();
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
