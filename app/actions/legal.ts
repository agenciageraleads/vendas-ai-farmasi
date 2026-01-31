'use server';

import { prisma } from '@/lib/prisma';

/**
 * Registra o aceite dos termos de uso e política financeira.
 * Obrigatório para compliance LGPD e Jurídico Financeiro.
 */
export async function registerTermAcceptance(userId: string, ipAddress: string, userAgent: string) {
    if (!userId || !ipAddress) {
        throw new Error('Dados insuficientes para auditoria.');
    }

    // Versão hardcoded por enquanto, idealmente viria de uma config
    const CURRENT_TERM_VERSION = 'v1.0-2026';

    const acceptance = await prisma.legalTermAcceptance.create({
        data: {
            userId,
            ipAddress,
            userAgent,
            termVersion: CURRENT_TERM_VERSION
        }
    });

    return { success: true, acceptanceId: acceptance.id, timestamp: acceptance.acceptedAt };
}

/**
 * Verifica se o usuário já aceitou a versão atual dos termos.
 */
export async function hasAcceptedCurrentTerms(userId: string) {
    const CURRENT_TERM_VERSION = 'v1.0-2026';

    const acceptance = await prisma.legalTermAcceptance.findFirst({
        where: {
            userId,
            termVersion: CURRENT_TERM_VERSION
        }
    });

    return !!acceptance;
}
