export function generateVoiceReply(assistant, module, context) {
    const voices = {
        jarvis: {name: "Google UK", lang: "en-GB", rate: 0.9, pitch: 0.75},
        kitt: {name: "Google US", lang: "en-US", rate: 1.2, pitch: 0.5},
    };

    const replies = {
        cave: {
            jarvis: "Ouverture de la cave. Température nominale. Le merlot semble impatient.",
            kitt: `Température intérieure ${context.temperature} degrès. Sécurité stock OK.`,
        },
        jardin: {
            jarvis: "Module jardin activé. La menthe respirre. L'ortie se rebelle.",
            kitt: "Prvisions météo favorables."
        }
    };
    return {
        voice: voices
    };
}