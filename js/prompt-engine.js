/**
 * VEKA GenAI Excellence - Prompt Engine
 * Manages the VEKA Prompt Library and custom user prompts
 */

class PromptEngine {
    constructor() {
        this.promptLibrary = [
            { id: 'p1', category: 'Everyday Writing', title: 'The three-line update', content: 'You are a concise enterprise communicator.\nContext: [CONTEXT]\nTask: Write a three-line status update.\nTone: Professional and direct.\nFormat: Three bullet points.' },
            { id: 'p2', category: 'Everyday Writing', title: 'Say no, politely and finally', content: 'You are an executive assistant.\nContext: We cannot fulfill this request.\nTask: Write a polite but firm decline email.\nTone: Empathetic but unwavering.\nFormat: Short email.' },
            { id: 'p3', category: 'High-Stakes Writing', title: 'Late supplier chaser', content: 'You are a procurement manager at VEKA.\nContext: Supplier is 3 days late on critical materials.\nTask: Draft a firm follow-up email demanding a revised timeline.\nTone: Firm, urgent, professional.\nFormat: Email with clear call to action.' },
            { id: 'p4', category: 'Finance & Accounts', title: 'Payment reminder ladder', content: 'You are an Accounts Receivable manager.\nContext: Invoice # [INVOICE] is [DAYS] past due.\nTask: Write a payment reminder.\nTone: Firm and clear.\nFormat: Short professional email.' },
            { id: 'p5', category: 'Operations & Maintenance', title: 'SOP out of someone\'s head', content: 'You are an operations documentarian.\nContext: [MESSY NOTES]\nTask: Convert these notes into a structured Standard Operating Procedure.\nTone: Clear, instructive.\nFormat: Numbered steps with warnings highlighted.' },
            { id: 'p6', category: 'Sales & Customers', title: 'Objection handling', content: 'You are a senior VEKA sales director.\nContext: Customer objects to price because of [REASON].\nTask: Draft a response highlighting total cost of ownership and quality.\nTone: Confident, consultative.\nFormat: Short talking points.' },
            { id: 'p7', category: 'HR & People', title: 'Policy in plain language', content: 'You are an HR communicator.\nContext: [COMPLEX POLICY TEXT]\nTask: Translate this policy into plain language for shop floor employees.\nTone: Simple, accessible, encouraging.\nFormat: FAQ style.' },
            { id: 'p8', category: 'Thinking / Meetings', title: 'Explain it like I\'m new', content: 'You are an expert in [TOPIC].\nContext: I am a new employee with no background in this.\nTask: Explain the core concepts of [TOPIC].\nTone: Patient, illustrative.\nFormat: Simple paragraphs with one analogy.' }
        ];
        this.rescueKit = [
            "Shorter. Cut a third.",
            "Add one concrete detail.",
            "Say that again for someone tired and in a hurry.",
            "What did you assume that I didn't tell you?",
            "Give me three versions: gentlest / neutral / firmest.",
            "Match the style of this.",
            "Where might you be wrong?",
            "Cite the row/source for every claim.",
            "Flag it, don't fix it.",
            "Turn this into a template with bracketed blanks."
        ];
    }
    
    // Will be populated in Phase 4
    getPromptsByCategory(category) {
        return this.promptLibrary.filter(p => p.category === category);
    }
}

window.promptEngine = new PromptEngine();
