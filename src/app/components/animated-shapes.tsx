import { motion } from "motion/react";

export function AnimatedShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20"
        style={{ backgroundColor: '#fde68a', bottom: '20%', top: '15%', right: '75%' }}
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-64 h-64 opacity-10"
        style={{ backgroundColor: '#ffffff', bottom: '20%', left: '25%', transform: 'rotate(45deg)' }}
        animate={{
          rotate: [45, 60, 45],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full opacity-15"
        style={{ backgroundColor: '#fde68a', top: '60%',bottom: '20%', right: '25%'  }}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-84 h-84 opacity-15"
        style={{ backgroundColor: '#fde68a', top: '20%', right: '10%' }}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          rotate: [45, 60, 45],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"

        }}
      />
    </div>
  );
}

export default AnimatedShapes;
