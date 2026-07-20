'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EscudoDigitalPDFDocument } from './EscudoDigitalPDFDocument';

interface Props {
    nombreEmpresa: string;
    listaBlanca: string;
    listaProhibida: string;
}

export const EscudoDigitalDownloadButton: React.FC<Props> = ({ nombreEmpresa, listaBlanca, listaProhibida }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <button className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem', opacity: 0.7, cursor: 'not-allowed' }}>
                ⏳ Cargando motor PDF...
            </button>
        );
    }

    return (
        <PDFDownloadLink
            document={<EscudoDigitalPDFDocument nombreEmpresa={nombreEmpresa} listaBlanca={listaBlanca} listaProhibida={listaProhibida} />}
            fileName={`Escudo_Digital_${nombreEmpresa || 'Empresa'}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <button
                    className="btn btn-primary"
                    style={{ padding: '0.9rem 2rem', fontSize: '1rem', whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    disabled={loading}
                >
                    {loading ? '⏳ Generando PDF Premium...' : '⬇️ Descargar Escudo Digital (PDF Alta Calidad)'}
                </button>
            )}
        </PDFDownloadLink>
    );
};
