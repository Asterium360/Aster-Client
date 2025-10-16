import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import fondogalaxia from '../assets/fondogalaxia.jpg';


const GalaxyBackground = ({ children }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Configuración de la escena
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rendererRef.current = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // Crear galaxia de estrellas
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 9500;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        const colorPalette = [
            new THREE.Color(0x4fc3f7),
            new THREE.Color(0xba68c8),
            new THREE.Color(0xffffff),
            new THREE.Color(0x000080),
            new THREE.Color(0x081136),
            new THREE.Color(0x81c784),
            new THREE.Color(0xff006e),
            new THREE.Color(0x8338ec),
            new THREE.Color(0x3a86ff),
            new THREE.Color(0xf9e37c),
        ];

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;

            // Posiciones en espiral galaxia
            const radius = Math.random() * 50;
            const spinAngle = radius * 0.3;
            const branchAngle = ((i % 3) / 3) * Math.PI * 2;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 2;
            positions[i3 + 1] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 2;

            // Colores variados
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Tamaños variables
            sizes[i] = Math.random() * 3;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Crear textura circular para las estrellas con aura brillante y cruz
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Aura exterior (halo tenue grande)
        const outerGlow = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        outerGlow.addColorStop(0, 'rgba(255, 255, 255, 0)');
        outerGlow.addColorStop(0.1, 'rgba(255, 255, 255, 0.05)');
        outerGlow.addColorStop(0.3, 'rgba(255, 255, 255, 0.15)');
        outerGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        outerGlow.addColorStop(0.7, 'rgba(255, 255, 255, 0.03)');
        outerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = outerGlow;
        ctx.fillRect(0, 0, 64, 64);

        // Núcleo brillante (centro intenso)
        const coreGlow = ctx.createRadialGradient(32, 32, 0, 32, 32, 12);
        coreGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
        coreGlow.addColorStop(0.1, 'rgba(255, 255, 255, 1)');
        coreGlow.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
        coreGlow.addColorStop(0.6, 'rgba(255, 255, 255, 0.6)');
        coreGlow.addColorStop(0.8, 'rgba(255, 255, 255, 0.3)');
        coreGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = coreGlow;
        ctx.fillRect(0, 0, 64, 64);

        // Rayos de difracción (efecto cruz estelar ✨)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.2;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(32, 0);
        ctx.lineTo(32, 64);
        ctx.moveTo(0, 32);
        ctx.lineTo(64, 32);
        ctx.stroke();

        const starTexture = new THREE.CanvasTexture(canvas);

        // Material de las estrellas con aura
        const starMaterial = new THREE.PointsMaterial({
            size: 0.1,
            map: starTexture,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Nebulosas (partículas grandes con glow)
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaCount = 50;
        const nebulaPositions = new Float32Array(nebulaCount * 3);
        const nebulaColors = new Float32Array(nebulaCount * 3);

        for (let i = 0; i < nebulaCount; i++) {
            const i3 = i * 3;
            nebulaPositions[i3] = (Math.random() - 0.5) * 100;
            nebulaPositions[i3 + 1] = (Math.random() - 0.5) * 100;
            nebulaPositions[i3 + 2] = (Math.random() - 0.5) * 100;

            const nebulaColor = new THREE.Color();
            nebulaColor.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.5);
            nebulaColors[i3] = nebulaColor.r;
            nebulaColors[i3 + 1] = nebulaColor.g;
            nebulaColors[i3 + 2] = nebulaColor.b;
        }

        nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
        nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

        // Crear textura circular para nebulosas con más brillo
        const nebulaCanvas = document.createElement('canvas');
        nebulaCanvas.width = 64;
        nebulaCanvas.height = 64;
        const nebulaCtx = nebulaCanvas.getContext('2d');

        const nebulaGradient = nebulaCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        nebulaGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        nebulaGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.7)');
        nebulaGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        nebulaGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
        nebulaGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        nebulaCtx.fillStyle = nebulaGradient;
        nebulaCtx.fillRect(0, 0, 64, 64);

        const nebulaTexture = new THREE.CanvasTexture(nebulaCanvas);

        const nebulaMaterial = new THREE.PointsMaterial({
            size: 4,
            map: nebulaTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
        scene.add(nebula);

        // Variables para el mouse parallax
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Variables para el efecto de movimiento hacia adelante
        const starPositionsArray = starGeometry.attributes.position.array;
        const nebulaPositionsArray = nebulaGeometry.attributes.position.array;

        // Animación
        const animate = () => {
            requestAnimationFrame(animate);

            // 🚀 Efecto de viaje espacial - estrellas viniendo hacia ti
            for (let i = 0; i < starCount; i++) {
                const i3 = i * 3;

                // Mover en el eje Z (hacia la cámara)
                starPositionsArray[i3 + 2] += 0.01;

                // Si la estrella pasa la cámara, reiniciarla atrás
                if (starPositionsArray[i3 + 2] > 5) {
                    starPositionsArray[i3 + 2] = -50;

                    // Reposicionar en X e Y también
                    const radius = Math.random() * 50;
                    const angle = Math.random() * Math.PI * 2;
                    starPositionsArray[i3] = Math.cos(angle) * radius;
                    starPositionsArray[i3 + 1] = Math.sin(angle) * radius;
                }
            }

            // Actualizar las posiciones
            starGeometry.attributes.position.needsUpdate = true;

            // 🌫️ Nebulosas también se mueven (más lento)
            for (let i = 0; i < nebulaCount; i++) {
                const i3 = i * 3;
                nebulaPositionsArray[i3 + 2] += 0.05;

                if (nebulaPositionsArray[i3 + 2] > 5) {
                    nebulaPositionsArray[i3 + 2] = -50;
                    nebulaPositionsArray[i3] = (Math.random() - 0.5) * 100;
                    nebulaPositionsArray[i3 + 1] = (Math.random() - 0.5) * 100;
                }
            }

            nebulaGeometry.attributes.position.needsUpdate = true;

            // Rotación sutil adicional
            stars.rotation.y += 0.0001;

            nebula.rotation.y -= 0.00005;

            // Efecto parallax suave con el mouse
            targetX = mouseX * 0.3;
            targetY = mouseY * 0.3;

            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (targetY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Redimensionar
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            starGeometry.dispose();
            starMaterial.dispose();
            starTexture.dispose();
            nebulaGeometry.dispose();
            nebulaMaterial.dispose();
            nebulaTexture.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div className="relative w-full min-h-screen">
            {/* Canvas de Three.js */}
            <div
                ref={mountRef}
                className="fixed top-0 left-0 w-full h-full -z-10"
                style={{
                    background: `
                                linear-gradient(to bottom, rgba(2, 6, 13, 0.4), rgba(2, 6, 13, 0.8)),
                                url(${fondogalaxia})
                                `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
                ></div>
                {/* Contenido por encima */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default GalaxyBackground;