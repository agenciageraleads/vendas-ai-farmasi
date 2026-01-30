'use client';

import { useState } from 'react';

export default function StoreClient({ products, consultantId, consultantName }: { products: any[], consultantId: string, consultantName: string }) {
    const [cart, setCart] = useState<any[]>([]);

    const addToCart = (product: any) => {
        setCart([...cart, product]);
        alert(`${product.name} adicionado ao carrinho!`);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return alert('Seu carrinho está vazio!');

        const itemsText = cart.map(i => `- ${i.name} (R$ ${i.price.toFixed(2)})`).join('%0A');
        const total = cart.reduce((acc, i) => acc + i.price, 0);
        const message = `Olá ${consultantName}! Gostaria de comprar:%0A${itemsText}%0ATotal: R$ ${total.toFixed(2)}%0A%0AVi na sua loja Farmasi!`;

        // Redirect to WhatsApp
        window.open(`https://wa.me/55000000000?text=${message}`, '_blank');
    };

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {products.map((product) => (
                    <div key={product.id} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-50 overflow-hidden relative">
                        <div className="absolute top-2 left-2 z-10">
                            <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-pink-600 shadow-sm uppercase">Novo</span>
                        </div>

                        <div className="aspect-square w-full bg-gray-100 rounded-xl mb-6 flex items-center justify-center text-gray-300 font-bold text-4xl group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {product.name.substring(0, 2)}
                        </div>

                        <div className="flex-1 flex flex-col text-center md:text-left">
                            <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-1">Farmasi Digital</p>
                            <h4 className="text-sm md:text-base font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h4>

                            <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 line-through">R$ {(product.price * 1.2).toFixed(2)}</span>
                                    <span className="text-lg font-black text-gray-900 leading-none">R$ {product.price.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    className="bg-gray-900 text-white text-xs font-bold py-3 px-4 rounded-xl hover:bg-pink-600 transition-colors shadow-lg active:scale-95 duration-150"
                                >
                                    ADICIONAR
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-gray-400">
                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                            {product.stock} disponivais
                        </div>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <div className="fixed bottom-8 right-8 z-[60]">
                    <button
                        onClick={handleCheckout}
                        className="bg-pink-600 text-white px-8 py-4 rounded-full font-black shadow-2xl hover:bg-pink-700 transition-all flex items-center gap-2 animate-bounce hover:animate-none"
                    >
                        <span>🚀</span> FINALIZAR PEDIDO ({cart.length})
                    </button>
                </div>
            )}
        </div>
    );
}
