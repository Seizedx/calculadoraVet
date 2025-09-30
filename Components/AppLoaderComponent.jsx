import { useEffect, useState } from "react";
import LoadingComponent from "./LoadingComponent";


export default function AppLoader({ children }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadResources = async () => {
            try {

                // 3. Simula carregamento de dados iniciais
                // await fetchInitialData();

                // Espera 500ms para dar tempo do layout estabilizar
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (error) {
                console.error("Erro no carregamento:", error);
            } finally {
                setLoading(false);
            }
        };
        loadResources();
    }, []);

    if (loading) {
        return <LoadingComponent />;
    }

    return children;
}
