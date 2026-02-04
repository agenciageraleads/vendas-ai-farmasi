'use client';

import { Opportunity } from "@/app/actions/crm";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function CRMDashboardWidget({ opportunities }: { opportunities: Opportunity[] }) {
    if (opportunities.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="text-4xl mb-2">🏖️</div>
                <h3 className="font-bold text-lg">Tudo em dia!</h3>
                <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-1">
                    Nenhum cliente precisando de reposição hoje.
                </p>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[var(--text-lg)] flex items-center gap-2">
                    🎯 Oportunidades do Dia
                    <Badge variant="info" size="md">{opportunities.length}</Badge>
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {opportunities.map(opp => (
                    <div
                        key={opp.id}
                        className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:bg-[var(--bg-secondary)] transition group cursor-pointer"
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-[var(--text-sm)]">{opp.clientName}</span>
                                {opp.status === 'URGENT' && (
                                    <Badge variant="error" size="sm">URGENTE</Badge>
                                )}
                            </div>
                            <p className="text-[var(--text-xs)] text-[var(--text-secondary)] mt-1">
                                <span className="font-medium text-[var(--text-primary)]">{opp.productName}</span> • Comprou há {opp.daysSincePurchase} dias.
                            </p>
                        </div>

                        <a
                            href={`https://wa.me/55${opp.clientPhone?.replace(/\D/g, '')}?text=Oi ${opp.clientName}! Notei que sua ${opp.productName} deve estar acabando. Posso separar outra?`}
                            target="_blank"
                            className="w-12 h-12 bg-[var(--success-bg)] text-[var(--success)] rounded-full flex items-center justify-center hover:bg-[var(--success)] hover:text-white transition shadow-sm text-xl"
                            title="Mandar WhatsApp"
                        >
                            📞
                        </a>
                    </div>
                ))}
            </div>
        </Card>
    );
}
