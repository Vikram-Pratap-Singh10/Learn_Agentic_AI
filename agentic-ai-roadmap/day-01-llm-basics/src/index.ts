import "dotenv/config";
import { askLLM } from "./llm.js";
import readline from "node:readline/promises";


async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    console.log("================================");
    console.log("       Gemini AI Assistant");
    console.log("================================");
    console.log("Type 'exit' to quit.\n");

    while (true) {
        const question = await rl.question("You: ");
        if (question.toLowerCase() === "exit") {
            break;
        }
        if (!question.trim()) {
            continue;
        }
        try {
            // const answer = await askLLM("Explain MongoDB indexing to a senior backend developer.");
            const answer = await askLLM(question);

            console.log("\nAI Response:\n");
            console.log(answer);
            console.log();
        
        } catch (error) {
            console.error("\nFailed to get response from Gemini AI:", error);
        }
    }
    rl.close();

    console.log("\nThank you for using Gemini AI Assistant. Goodbye!");
}

main().catch((error) => {
    console.error("Gemini request failed:", error);
    process.exit(1);
});