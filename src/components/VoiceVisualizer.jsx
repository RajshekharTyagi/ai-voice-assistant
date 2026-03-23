import { useEffect, useRef } from 'react';

export default function VoiceVisualizer({ 
  isActive = false, 
  type = 'listening', // 'listening' or 'speaking'
  className = '' 
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let animationTime = 0;

    const animate = () => {
      if (!isActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationTime += 0.1;

      if (type === 'listening') {
        // Listening visualization - concentric circles
        for (let i = 0; i < 3; i++) {
          const radius = 20 + i * 15 + Math.sin(animationTime + i) * 5;
          const opacity = 0.3 - i * 0.1;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (type === 'speaking') {
        // Speaking visualization - sound waves
        const bars = 8;
        const barWidth = 4;
        const spacing = 8;
        const startX = centerX - (bars * (barWidth + spacing)) / 2;

        for (let i = 0; i < bars; i++) {
          const height = 10 + Math.sin(animationTime + i * 0.5) * 20;
          const x = startX + i * (barWidth + spacing);
          const y = centerY - height / 2;
          
          ctx.fillStyle = `rgba(147, 51, 234, ${0.7 + Math.sin(animationTime + i) * 0.3})`;
          ctx.fillRect(x, y, barWidth, height);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isActive) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, type]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className={`${className}`}
      style={{ background: 'transparent' }}
    />
  );
}