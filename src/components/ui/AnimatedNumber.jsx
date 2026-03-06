import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 1, duration = 800, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    const startVal = 0;
    const endVal = typeof value === 'number' ? value : parseFloat(value) || 0;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(startVal + (endVal - startVal) * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(endVal);
      }
    };

    requestAnimationFrame(tick);
  }, [value, isInView, duration]);

  const formatted = typeof value === 'number'
    ? `${prefix}${display.toFixed(decimals)}${suffix}`
    : `${prefix}${value}${suffix}`;

  return (
    <motion.span ref={ref} className={`font-mono ${className}`}>
      {formatted}
    </motion.span>
  );
}
