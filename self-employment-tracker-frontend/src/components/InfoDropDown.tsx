import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type InfoText = string | Record<string, any> | Array<Record<string, any>>;

function InfoDropdown({ title, text }: { title: string; text: InfoText }) {
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
                        {typeof text === 'string' ? (
                            <p>{text}</p>
                        ) : Array.isArray(text) ? (
                            <div className="flex flex-col gap-3">
                                {text.length === 0 ? (
                                    <p>No data found</p>
                                ) : (
                                    text.map((item, idx) => (
                                        <div key={idx} className="border p-2 rounded">
                                            <p className="font-bold">Item {idx + 1}</p>
                                            <div className="mt-2">
                                                {Object.entries(item).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between">
                                                        <span className="font-semibold mr-2">{k}:</span>
                                                        <span>{String(v ?? '')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {Object.keys(text).length === 0 ? (
                                    <p>No data found</p>
                                ) : (
                                    Object.entries(text).map(([k, v]) => (
                                        <div key={k} className="flex justify-between py-1">
                                            <span className="font-semibold mr-2">{k}:</span>
                                            <span>{String(v ?? '')}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </motion.div>

                )}
            </AnimatePresence>
        </div>
    );
}

export default InfoDropdown;
