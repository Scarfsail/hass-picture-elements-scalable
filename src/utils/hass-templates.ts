import type { Connection } from "home-assistant-js-websocket";

export interface TemplateListeners {
    all: boolean;
    domains: string[];
    entities: string[];
    time: boolean;
}

export interface RenderTemplateResult {
    result: string;
    listeners: TemplateListeners;
}

export interface RenderTemplateError {
    error: string;
    level: "ERROR" | "WARNING";
}

type SubscriptionUnsubscribe = () => Promise<void>;

export async function subscribeRenderTemplate(connection: Connection, template: string, onChange: (result: string) => void): Promise<SubscriptionUnsubscribe> {
    const unsubscribe = await connection.subscribeMessage((msg: RenderTemplateResult | RenderTemplateError) => {
        if ("result" in msg) {
            onChange(msg.result);
        } else {
            console.error(`Error evaluating template (${template}):`, msg.error);
            onChange(`Error evaluating template: ${msg.error}`);
        }
    }, { type: "render_template", template: template });

    return unsubscribe;
}

export async function evaluateTemplate(connection: Connection, template: string): Promise<string> {
    if (!template.includes('{{'))
        return template;

    try {
        // Call the template API to evaluate the template
        const response = await connection.sendMessagePromise({
            type: "render_template",
            template: template,
        });

        return (response as RenderTemplateResult).result;
    } catch (err) {
        console.error("Error evaluating template:", err);
        return "Error evaluating template.";
    }
}