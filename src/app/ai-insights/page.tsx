import AiClient from "./_components/ai-client";

export default function AiInsightsPage() {
    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Intelligent Alerting Tool</h1>
                <p className="text-muted-foreground">
                    Generate predictive restock alerts using AI analysis of your usage patterns.
                </p>
            </header>
            <AiClient />
        </div>
    );
}
