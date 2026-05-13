import { motion, useScroll, useTransform } from 'framer-motion';

export default function BackgroundScene() {
    const { scrollY } = useScroll();

    // Parallax layers for scroll interactions
    const bgY1 = useTransform(scrollY, [0, 5000], [0, -1000]);
    const bgY2 = useTransform(scrollY, [0, 5000], [0, -500]);
    const bgY3 = useTransform(scrollY, [0, 5000], [0, -1500]);

    return (
        <div className="fixed inset-0 z-0 bg-[#F2F4F7] overflow-hidden pointer-events-none">
            {/* Bright ambient glows */}
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

            {/* Clean grid pattern */}
            <div className="absolute inset-0 bg-[#18112E]/[0.03] pattern-dots bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] opacity-80" />

            {/* Floating geometric shapes (Johnny's Dirty Soda vibe with scroll Parallax) */}
            {typeof window !== 'undefined' && [...Array(15)].map((_, i) => {
                const size = Math.random() * 80 + 40;
                const parallaxLayer = i % 3 === 0 ? bgY1 : i % 3 === 1 ? bgY2 : bgY3;

                return (
                    <motion.div
                        key={i}
                        className={`absolute border-4 border-[#18112E] shadow-[8px_8px_0_#18112E] ${i % 3 === 0 ? 'rounded-full bg-[#FFB800]' :
                            i % 3 === 1 ? 'rounded-[20px] bg-[#3AA8F5]' :
                                'rounded-[0px] bg-white'
                            }`}
                        style={{ width: size, height: size, y: parallaxLayer }}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            top: Math.random() * (window.innerHeight + 1000) - 200, // random start y
                            rotate: Math.random() * 360,
                            scale: 0
                        }}
                        animate={{
                            rotate: [null, Math.random() * 360 + 180],
                            scale: [0, 1, 1],
                            opacity: [0, 1, 0.8]
                        }}
                        transition={{
                            duration: Math.random() * 15 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: Math.random() * 2
                        }}
                    />
                );
            })}
        </div>
    );
}
