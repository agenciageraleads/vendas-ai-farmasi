'use client';

import { useState, useEffect } from 'react';
import { searchProducts } from '@/app/actions/catalog';
import { addStock } from '@/app/actions/inventory';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function StockEntryForm({ userId }: { userId: string }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const [quantity, setQuantity] = useState(1);
    const [unitCost, setUnitCost] = useState(0);
    const [location, setLocation] = useState('Casa');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                const prods = await searchProducts(query);
                setResults(prods);
            } else {
                setResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (prod: any) => {
        setSelectedProduct(prod);
        setUnitCost(Number(prod.costPrice));
        setQuery('');
        setResults([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            const res = await addStock(userId, selectedProduct.sku, quantity, unitCost, location, note);
            if (res.success) {
                setFeedback({ type: 'success', msg: `Entrada realizada! Custo Médio será reajustado.` });
                setQuantity(1);
                setSelectedProduct(null);
                setQuery('');
            }
        } catch (err) {
            setFeedback({ type: 'error', msg: 'Erro ao processar entrada. Verifique os dados.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                📦 Entrada Manual de Estoque
            </h2>

            {feedback && (
                <div className={`p-4 mb-4 rounded-lg ${feedback.type === 'success'
                        ? 'bg-[var(--success-bg)] text-[var(--success)]'
                        : 'bg-[var(--error-bg)] text-[var(--error)]'
                    }`}>
                    {feedback.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Product Search */}
                <div className="relative">
                    <Input
                        label="Buscar Produto (Nome ou SKU)"
                        type="text"
                        value={selectedProduct ? selectedProduct.name : query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (selectedProduct) setSelectedProduct(null);
                        }}
                        placeholder="Ex: Perfume..."
                    />

                    {/* Dropdown Results */}
                    {results.length > 0 && !selectedProduct && (
                        <div className="absolute z-10 w-full bg-white border border-gray-100 shadow-xl rounded-lg mt-1 max-h-60 overflow-y-auto">
                            {results.map(prod => (
                                <div
                                    key={prod.id}
                                    onClick={() => handleSelect(prod)}
                                    className="p-3 hover:bg-[var(--bg-secondary)] cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
                                >
                                    <span className="font-medium">{prod.name}</span>
                                    <Badge variant="neutral" size="sm">{prod.sku}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedProduct && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--bg-secondary)] p-4 rounded-lg border border-gray-100">
                        <Input
                            label="Quantidade"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />

                        <Input
                            label="Custo Unitário (R$)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={unitCost}
                            onChange={(e) => setUnitCost(Number(e.target.value))}
                            helperText="Valor pago por unidade nesta nota fiscal"
                        />

                        <div>
                            <label className="block mb-2 text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">
                                Localização
                            </label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--bg-tertiary)] focus:border-[var(--primary-500)] focus:ring-4 focus:ring-[rgba(106,77,253,0.1)] transition-all duration-200 ease-out bg-[var(--bg-primary)]"
                            >
                                <option value="Casa">Casa (Padrão)</option>
                                <option value="Carro">Carro / Mala</option>
                                <option value="Escritorio">Escritório</option>
                            </select>
                        </div>

                        <Input
                            label="Nota Fiscal / Obs"
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ex: NF 4500..."
                        />
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={!selectedProduct || loading}
                        variant="primary"
                        size="lg"
                        loading={loading}
                        className="w-full"
                    >
                        {loading ? 'Processando...' : 'Confirmar Entrada'}
                    </Button>

                    {!selectedProduct && (
                        <p className="text-center text-[var(--text-sm)] text-[var(--text-tertiary)] mt-2">
                            Selecione um produto para habilitar a entrada.
                        </p>
                    )}
                </div>
            </form>
        </Card>
    );
}
