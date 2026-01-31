'use server';

import { prisma } from '@/lib/prisma';

// Placeholder para SDK do Asaas
// No futuro, instalar `asaas-sdk` ou usar fetch direto

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export async function createAsaasCustomer(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user || !user.cpf) throw new Error('Dados de cliente incompletos (CPF obrigatório)');

    // Mock implementation for Phase 1
    console.log(`[Asaas] Creating customer for ${user.email} with CPF ${user.cpf}`);

    return {
        id: `cus_mock_${Date.now()}`,
        name: user.name,
        cpfCnpj: user.cpf
    };
}

export async function createPaymentLink(orderId: string, value: number, dueDate: Date) {
    // Mock implementation
    console.log(`[Asaas] Creating payment link for Order ${orderId} - Value: ${value}`);

    return {
        id: `pay_mock_${Date.now()}`,
        invoiceUrl: `https://sandbox.asaas.com/i/mock/${orderId}`,
        netValue: value * 0.98 // Simulating fees
    };
}
