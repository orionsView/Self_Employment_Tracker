import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function InfoDropdown({ title, text }: { title: string; text: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    // useEffect(() => {
    //     function handleClickOutside(event: MouseEvent) {
    //         if (
    //             containerRef.current &&
    //             !containerRef.current.contains(event.target as Node)
    //         ) {
    //             setIsOpen(false);
    //         }
    //     }
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, []);

    return (
        <div ref={containerRef} className="w-full">
            {/* Trigger */}
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="cursor-pointer p-3 bg-blue-500 text-white rounded-lg"
            >
                {title}
            </div>

            {/* Animated text block */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 1, maxHeight: 0 }}
                        animate={{ opacity: 1, maxHeight: 500 }} // big enough to fit content
                        exit={{ opacity: 1, maxHeight: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-gray-700"
                    >
                        <p>{text}</p>
                    </motion.div>

                )}
            </AnimatePresence>
        </div>
    );
}

export default InfoDropdown;
