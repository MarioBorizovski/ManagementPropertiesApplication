import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, LayoutGrid } from 'lucide-react'

export const PropertyGallery = ({ property }) => {
    const images = property?.imageUrls || (property?.mainImageUrl ? [property.mainImageUrl] : [])
    const [activeImage, setActiveImage] = useState(0)
    const [isRibbonOpen, setIsRibbonOpen] = useState(false)

    // keyboard navigation
    useEffect(() => {
        if (!isRibbonOpen) return
        const handler = (e) => {
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft')  prev()
            if (e.key === 'Escape')     setIsRibbonOpen(false)
        }
        window.addEventListener('keydown', handler)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', handler)
            document.body.style.overflow = 'unset'
        }
    }, [isRibbonOpen, activeImage])

    const next = () => setActiveImage(i => (i + 1) % images.length)
    const prev = () => setActiveImage(i => (i - 1 + images.length) % images.length)

    if (images.length === 0) return null

    return (
        <div className="relative group/gallery">
            {/* ── Main Grid: Boxed & Separated (Theme Adaptive) ── */}
            <div className="relative h-[540px] rounded-[48px] overflow-hidden bg-white dark:bg-[#261f1c] p-4 border border-border-warm shadow-2xl transition-colors duration-300">
                <div className="grid grid-cols-4 grid-rows-2 h-full gap-4">
                   <div 
                        className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden rounded-[36px] shadow-sm transition-all hover:shadow-2xl group/img"
                        onClick={() => { setActiveImage(0); setIsRibbonOpen(true) }}
                   >
                        <img src={images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-105" alt="Main" />
                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors" />
                   </div>

                   {images.slice(1, 5).map((url, i) => (
                        <div 
                            key={i} 
                            className="relative cursor-pointer overflow-hidden rounded-[24px] shadow-sm transition-all hover:shadow-2xl group/img"
                            onClick={() => { setActiveImage(i + 1); setIsRibbonOpen(true) }}
                        >
                            <img src={url} className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110" alt="Detail" />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
                        </div>
                   ))}
                </div>

                <button 
                    onClick={() => { setActiveImage(0); setIsRibbonOpen(true) }}
                    className="absolute bottom-10 right-10 flex items-center gap-2 px-6 py-3 bg-white/90 dark:bg-black/60 backdrop-blur-md border border-border-warm dark:border-white/10 rounded-2xl text-sm font-black text-title dark:text-white shadow-2xl hover:scale-105 active:scale-95 transition-all z-10"
                >
                    <LayoutGrid size={16} className="text-brand" />
                    Show all photos
                </button>
            </div>

            {/* ── Ribbon Carousel Overview (Controlled Transform / Dark) ── */}
            {isRibbonOpen && createPortal(
                <div 
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden"
                >
                    {/* Dark Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
                        onClick={() => setIsRibbonOpen(false)}
                    />

                    {/* Controls Header */}
                    <div className="absolute top-0 left-0 right-0 h-24 px-12 flex items-center justify-between z-20 pointer-events-none">
                        <button 
                            onClick={() => setIsRibbonOpen(false)}
                            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 shadow-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all pointer-events-auto active:scale-90"
                        >
                            <X size={20} />
                        </button>
                        <div className="px-6 py-2 rounded-full bg-white/10 border border-white/20 shadow-lg text-sm font-black text-white/90 tracking-widest pointer-events-auto">
                            {activeImage + 1} / {images.length}
                        </div>
                        <div className="w-12" />
                    </div>

                    {/* CONTROLLED RIBBON */}
                    <div className="relative w-full h-[65vh] z-10 flex flex-col justify-center overflow-hidden">
                        {/* Nav Buttons (Absolute to this container) */}
                        {images.length > 1 && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-10 z-30 w-16 h-16 rounded-full bg-white/10 border border-white/20 shadow-2xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all transform hover:-translate-x-2 active:scale-90 pointer-events-auto">
                                    <ChevronLeft size={32} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-10 z-30 w-16 h-16 rounded-full bg-white/10 border border-white/20 shadow-2xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all transform hover:translate-x-2 active:scale-90 pointer-events-auto">
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Ribbon Content (Now correctly aligned to start so math works) */}
                        <div className="flex items-center gap-[4vw] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                             style={{ 
                                transform: `translateX(calc(50vw - 22.5vw - (${activeImage} * (45vw + 4vw))))` 
                             }}
                        >
                            {images.map((url, i) => (
                                <div 
                                    key={i}
                                    className="flex-shrink-0 w-[45vw] h-[55vh] flex items-center justify-center cursor-pointer transition-opacity duration-700"
                                    style={{ opacity: i === activeImage ? 1 : 0.3 }}
                                    onClick={() => setActiveImage(i)}
                                >
                                    <div className={`w-full h-full rounded-[36px] overflow-hidden border-2 border-white/20 select-none shadow-2xl transition-all duration-700 ${
                                            i === activeImage ? 'scale-100' : 'scale-75'
                                    }`}>
                                        <img 
                                            src={url} 
                                            className="w-full h-full object-cover" 
                                            alt={`Slide ${i}`} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Label Area */}
                    <div className="relative mt-8 text-center z-10 pointer-events-none">
                        <h2 className="text-xl font-black text-white tracking-tight mb-0.5">
                            {property.title}
                        </h2>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">
                            Photography
                        </p>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
