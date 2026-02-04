'use server';

import { prisma } from '@/lib/prisma';

/**
 * Busca clientes por nome, CPF ou telefone
 * @param query - Termo de busca (mínimo 2 caracteres)
 * @returns Lista de clientes encontrados
 */
export async function searchCustomers(query: string) {
    if (query.length < 2) {
        return [];
    }

    // Remover caracteres especiais para busca por CPF/telefone
    const cleanQuery = query.replace(/\D/g, '');

    try {
        const customers = await prisma.user.findMany({
            where: {
                role: 'CUSTOMER',
                OR: [
                    // Busca por nome (case insensitive)
                    { name: { contains: query, mode: 'insensitive' } },
                    // Busca por CPF (apenas números)
                    ...(cleanQuery.length > 0 ? [{ cpf: { contains: cleanQuery } }] : []),
                    // Busca por telefone (apenas números)
                    ...(cleanQuery.length > 0 ? [{ phone: { contains: cleanQuery } }] : [])
                ]
            },
            select: {
                id: true,
                name: true,
                cpf: true,
                phone: true,
                email: true
            },
            take: 10,
            orderBy: { name: 'asc' }
        });

        return customers;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return [];
    }
}
