import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Nota: Em um app real, usaríamos cookies/session. 
    // No MVP, a verificação de onboarding é feita na própria página ou layout
    // Mas podemos proteger rotas admin aqui.

    return NextResponse.next();
}

export const config = {
    matcher: '/dashboard/:path*',
};
