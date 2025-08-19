// src/pages/LegalInformation.tsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LegalInformation = () => {

    const navigate = useNavigate();

    return (
        
        <div className="max-w-3xl mx-auto px-6 py-12 text-sm leading-relaxed text-justify">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-blue-600 hover:underline mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
            </button>

            <h1 className="text-2xl font-semibold mb-6">Información Legal y Licencias</h1>

        <p className="mb-4">
            Esta aplicación integra bibliotecas de terceros distribuidas bajo licencias de software libre y de código
            abierto. En cumplimiento con los principios de transparencia y respeto a los derechos de autor, se incluyen 
            los avisos legales correspondientes. El uso de estas dependencias se encuentra amparado por licencias 
            permisivas, lo cual permite su utilización, modificación y redistribución en distintos contextos, siempre que 
            se conserven las condiciones establecidas por los autores originales (American Psychological Association, 2020).
        </p>

        <p className="mb-6">
            A continuación, se presentan los avisos de licencia de las principales tecnologías empleadas en este proyecto.
        </p>

        {/* Radix UI */}
        <h2 className="text-lg font mt-4">Radix UI</h2>
        <pre className="bg-muted p-4 rounded overflow-auto text-xs mb-6">
            {`@radix-ui/react-accordion, @radix-ui/react-dialog, @radix-ui/react-tooltip, etc.
            Copyright (c) Radix UI contributors
            Licensed under the MIT License.`}
        </pre>

        {/* Vite */}
        <h2 className="text-lg font mt-4">Vite</h2>
        <pre className="bg-muted p-4 rounded overflow-auto text-xs mb-6">
        {`Vite (core)
        Copyright (c) 2019-present, Evan You and Vite contributors
        Licensed under the MIT License.`}
        </pre>

        {/* React */}
        <h2 className="text-lg font mt-4">React y React DOM</h2>
        <pre className="bg-muted p-4 rounded overflow-auto text-xs mb-6">
        {`React & React DOM
        Copyright (c) Meta Platforms, Inc. and affiliates
        Licensed under the MIT License.`}
        </pre>

        <p className="mt-6 text-muted-foreground text-xs">
            Última actualización: Agosto 2025  
            <br />
            Nota: Este apartado se proporciona con fines informativos. No constituye asesoría legal.
        </p>
        </div>
    );
};

export default LegalInformation;
