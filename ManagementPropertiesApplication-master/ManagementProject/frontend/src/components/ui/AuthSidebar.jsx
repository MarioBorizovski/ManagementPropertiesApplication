import { Leaf } from 'lucide-react'
import houseBg from '../../assets/modern_house_bg.png'

export default function AuthSidebar() {
    return (
        <div className="relative hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${houseBg})` }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80"></div>
            <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                <div className="flex items-center gap-2">
                    <div className="bg-brand p-1.5 rounded-lg">
                        <Leaf className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">PropManager</span>
                </div>
                
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                        Manage and book properties<br />with ease.
                    </h1>
                    <p className="text-gray-300 text-lg max-w-md">
                        Join thousands of property managers who trust PropManager to streamline their daily operations and tenant communications.
                    </p>
                </div>
            </div>
        </div>
    )
}

