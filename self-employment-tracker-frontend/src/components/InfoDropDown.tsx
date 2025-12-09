import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderCard } from "../constants/ui";

type InfoText = string | Record<string, any> | Array<Record<string, any>>;

function InfoDropdown({ title, text, editable = false }: { title: string; text: InfoText; editable: boolean }) {
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
        <div ref={containerRef} className="w-[100%] pb-4">
            {/* Trigger */}
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className={`${BorderCard} w-[100%] text-tertiaryColor `}
            >
                {title} {editable !== false && <span className="text-sm text-gray-500">(editable)</span>}
            </div>

            {/* Animated text block */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 1, maxHeight: 0 }}
                        animate={{ opacity: 1, maxHeight: 500 }} // big enough to fit content
                        exit={{ opacity: 1, maxHeight: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden mt-2 bg-tertiaryColor border border-gray-200 rounded-lg shadow-lg p-4 text-textColor"
                    >
                        {typeof text === 'string' ? (
                            editable == false ? <p>{text}</p> : <input type="text" defaultValue={text}></input>
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
                                                        <input defaultValue={String(v ?? '')} disabled={!editable} className={editable ? 'border-1' : ''}></input>
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
                                            <input defaultValue={String(v ?? '')} disabled={!editable} className={editable ? 'border-1' : ''}></input>

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
