import { motion, useScroll, useTransform } from 'framer-motion'; // eslint-disable-line no-unused-vars

function generateShapes(count) {
    return Array.from({ length: count }, () => ({
        size: Math.random() * 80 + 40,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        top: Math.random() * ((typeof window !== 'undefined' ? window.innerHeight : 1080) + 1000) - 200,
        rotateInit: Math.random() * 360,
        rotateAnim: Math.random() * 360 + 180,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 2,
    }));
}

const shapeCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 15;
const shapes = typeof window !== 'undefined' ? generateShapes(shapeCount) : [];

export default function BackgroundScene() {
    const { scrollY } = useScroll();

    const bgY1 = useTransform(scrollY, [0, 5000], [0, -1000]);
    const bgY2 = useTransform(scrollY, [0, 5000], [0, -500]);
    const bgY3 = useTransform(scrollY, [0, 5000], [0, -1500]);

    return (
        <div className="fixed inset-0 z-0 bg-[#F2F4F7] overflow-hidden pointer-events-none">
            <motion.div
                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#FFB800]/20 blur-[150px] rounded-full mix-blend-multiply"
                style={{ y: bgY2 }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#3AA8F5]/10 blur-[150px] rounded-full mix-blend-multiply"
                style={{ y: bgY1 }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            <div className="absolute inset-0 bg-[#18112E]/[0.03] pattern-dots bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] opacity-80" />

            {shapes.map((s, i) => {
                const parallaxLayer = i % 3 === 0 ? bgY1 : i % 3 === 1 ? bgY2 : bgY3;

                return (
                    <motion.div
                        key={i}
                        className={`absolute border-4 border-[#18112E] shadow-[8px_8px_0_#18112E] ${i % 3 === 0 ? 'rounded-full bg-[#FFB800]' :
                            i % 3 === 1 ? 'rounded-[20px] bg-[#3AA8F5]' :
                                'rounded-[0px] bg-white'
                            }`}
                        style={{ width: s.size, height: s.size, y: parallaxLayer }}
                        initial={{
                            x: s.x,
                            top: s.top,
                            rotate: s.rotateInit,
                            scale: 0
                        }}
                        animate={{
                            rotate: [null, s.rotateAnim],
                            scale: [0, 1, 1],
                            opacity: [0, 1, 0.8]
                        }}
                        transition={{
                            duration: s.duration,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: s.delay
                        }}
                    />
                );
            })}
        </div>
    );
}
