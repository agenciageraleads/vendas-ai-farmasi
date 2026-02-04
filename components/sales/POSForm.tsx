'use client';

import { useState, useEffect } from 'react';
import { searchProducts } from '@/app/actions/catalog';
import { createSale } from '@/app/actions/sales';
import CustomerAutocomplete from '@/components/CustomerAutocomplete';

export default function POSForm({ userId }: { userId: string }) {
    // Cart State
    const [cart, setCart] = useState<any[]>([]);

    // Product Search State
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    // Customer State
    const [customer, setCustomer] = useState({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        termsAccepted: false
    });

    const [loading, setLoading] = useState(false);
    const [successLink, setSuccessLink] = useState<string | null>(null);

    // Search Debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                const prods = await searchProducts(query);
                setResults(prods);
            } else setResults([]);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const addToCart = (prod: any) => {
        setCart(prev => {
            const existing = prev.find(p => p.sku === prod.sku);
            if (existing) {
                return prev.map(p => p.sku === prod.sku ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...prod, quantity: 1, unitPrice: Number(prod.basePrice) }];
        });
        setQuery('');
        setResults([]);
    };

    const removeFromCart = (sku: string) => {
        setCart(prev => prev.filter(p => p.sku !== sku));
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    const handleCheckout = async () => {
        if (!customer.termsAccepted) return alert('Cliente deve aceitar os termos.');
        if (!customer.cpf) return alert('CPF obrigatório.');

        setLoading(true);
        const res = await createSale(userId, cart.map(i => ({ sku: i.sku, quantity: i.quantity, unitPrice: i.unitPrice })), customer, 'BOLETO');
        setLoading(false);

        if (res.success) {
            setSuccessLink(res.paymentLink);
            setCart([]);
            setCustomer({ name: '', cpf: '', phone: '', email: '', termsAccepted: false });
        } else {
            alert(res.error);
        }
    };

    if (successLink) {
        return (
            <div className="bg-green-50 p-8 rounded-2xl text-center border border-green-200">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Venda Realizada!</h2>
                <p className="text-green-600 mb-6 font-medium">Estoque baixado e cobrança gerada.</p>
                <div className="flex flex-col gap-3">
                    <a href={successLink} target="_blank" className="bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition">
                        📄 Abrir Boleto/Link de Pagamento
                    </a>
                    <button onClick={() => setSuccessLink(null)} className="text-green-700 font-bold hover:underline">
                        Nova Venda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Catalog and Cart */}
            <div className="lg:col-span-2 space-y-6">

                {/* Search */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">1. Adicionar Produtos</h3>
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Buscar por nome ou SKU..."
                            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-black outline-none font-medium"
                        />
                        {results.length > 0 && (
                            <div className="absolute z-10 w-full bg-white shadow-xl rounded-xl mt-2 overflow-hidden border border-gray-100">
                                {results.map(prod => (
                                    <div
                                        key={prod.id}
                                        onClick={() => addToCart(prod)}
                                        className="p-4 hover:bg-primary-50 cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-b-0 transition"
                                    >
                                        {/* Foto do Produto */}
                                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            {prod.imageUrl ? (
                                                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info do Produto */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 text-sm truncate">{prod.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">SKU: {prod.sku}</p>
                                        </div>

                                        {/* Preço */}
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-primary-600">R$ {Number(prod.basePrice).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart Items */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Carrinho ({cart.length})</h3>
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-sm py-4">Nenhum item adicionado.</p>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.sku} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-xs text-gray-500">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{item.name}</p>
                                            <p className="text-[10px] text-gray-400">{item.sku}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => {
                                                const newPrice = Number(e.target.value);
                                                setCart(prev => prev.map(p => p.sku === item.sku ? { ...p, unitPrice: newPrice } : p));
                                            }}
                                            className="w-20 p-1 bg-white border border-gray-200 rounded text-right text-sm font-mono"
                                        />
                                        <button onClick={() => removeFromCart(item.sku)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="font-bold text-gray-500 uppercase text-xs">Total</span>
                                <span className="font-black text-2xl text-gray-900">R$ {cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Right Col: Customer & Checkout */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">2. Cliente & Pagamento</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-400 mb-2">
                                Buscar Cliente (Nome, CPF ou Telefone)
                            </label>
                            <CustomerAutocomplete
                                onSelect={(selectedCustomer) => {
                                    setCustomer({
                                        name: selectedCustomer.name || '',
                                        cpf: selectedCustomer.cpf || '',
                                        phone: selectedCustomer.phone || '',
                                        email: selectedCustomer.email || '',
                                        termsAccepted: customer.termsAccepted
                                    });
                                }}
                                placeholder="Digite para buscar cliente existente..."
                            />
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-xs text-gray-500 mb-3 font-medium">Ou preencha manualmente:</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={customer.name}
                                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-lg border-none text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">CPF (Obrigatório)</label>
                                    <input
                                        type="text"
                                        value={customer.cpf}
                                        onChange={e => setCustomer({ ...customer, cpf: e.target.value })}
                                        placeholder="000.000.000-00"
                                        className="w-full p-3 bg-gray-50 rounded-lg border-none text-sm font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">WhatsApp</label>
                                    <input
                                        type="text"
                                        value={customer.phone}
                                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-lg border-none text-sm font-bold"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={customer.termsAccepted}
                                            onChange={e => setCustomer({ ...customer, termsAccepted: e.target.checked })}
                                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="text-xs text-gray-500 group-hover:text-gray-700 transition">
                                            Declaro que o cliente leu e aceitou os <span className="underline text-blue-600">Termos de Uso e Política de Juros</span> para compras a prazo.
                                        </span>
                                    </label>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={loading || cart.length === 0 || !customer.termsAccepted || !customer.cpf}
                                    className={`w-full py-4 mt-4 rounded-xl font-black text-sm uppercase tracking-widest transition shadow-lg
                                ${loading || cart.length === 0 || !customer.termsAccepted || !customer.cpf
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                            : 'bg-black text-white hover:bg-gray-900 shadow-gray-300 hover:shadow-gray-400 transform active:scale-95'
                                        }
                            `}
                                >
                                    {loading ? 'Processando...' : `Finalizar Venda (R$ ${cartTotal.toFixed(2)})`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                );
}
