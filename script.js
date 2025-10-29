// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // --- Global State ---
    // This object will hold the user's data and the generated story
    const appState = {
        userData: null,
        currentStory: ""
    };

    // --- DOM Elements ---
    // We can safely select elements now because the DOM is loaded
    const screens = document.querySelectorAll('.screen');
    const storyForm = document.getElementById('story-form');
    const storyOutput = document.getElementById('story-output');
    const finalStoryPreview = document.getElementById('final-story-preview');
    const synthesisForm = document.getElementById('synthesis-form');
    const synthesisOutput = document.getElementById('synthesis-output');

    const loadingStory = document.getElementById('loading-story');
    const loadingSynthesis = document.getElementById('loading-synthesis');

    // --- Navigation Buttons ---
    const btnModify = document.getElementById('btn-modify');
    const btnFinalize = document.getElementById('btn-finalize');
    const btnBackToStory = document.getElementById('btn-back-to-story');

    // --- Navigation Function ---
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // --- Event Listener for Screen 1 (Story Form) ---
    storyForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission
        loadingStory.style.display = 'block'; // Show loading
        synthesisOutput.style.display = 'none'; // Hide old synthesis

        // 1. Gather form data
        const formData = new FormData(storyForm);
        appState.userData = Object.fromEntries(formData.entries());

        // 2. Call the (placeholder) AI model
        // 'await' simulates a network request
        appState.currentStory = await generateStory(appState.userData);

        // 3. Populate and show Screen 2
        storyOutput.textContent = appState.currentStory;
        loadingStory.style.display = 'none'; // Hide loading
        showScreen('screen-story');
    });

    // --- Event Listener for Screen 2 (Review Buttons) ---
    btnModify.addEventListener('click', () => {
        // Go back to the input screen (data is still in the form)
        showScreen('screen-input');
    });

    btnFinalize.addEventListener('click', () => {
        // Copy story to the preview box on Screen 3
        finalStoryPreview.textContent = appState.currentStory;
        showScreen('screen-synthesis');
    });

    // --- Event Listener for Screen 3 (Synthesis Form) ---
    synthesisForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingSynthesis.style.display = 'block';
        synthesisOutput.style.display = 'none'; // Clear previous output

        // 1. Get the selected tone
        const selectedTone = document.getElementById('synthesis-tone').value;

        // 2. Call the (placeholder) AI model
        const discussion = await synthesizeStory(appState.currentStory, selectedTone);

        // 3. Populate and show the output
        synthesisOutput.textContent = discussion;
        loadingSynthesis.style.display = 'none';
        synthesisOutput.style.display = 'block'; // Show the output box
    });

    btnBackToStory.addEventListener('click', () => {
        // Go back to the story review screen
        showScreen('screen-story');
    });

    // -----------------------------------------------------------------
    // --- !!! PLACEHOLDER AI FUNCTIONS (STUBS) !!! ---
    // -----------------------------------------------------------------
    // You will replace the logic inside these functions with your
    // actual API calls (e.g., using `fetch()`) to your AI models.
    // -----------------------------------------------------------------

    /**
     * AI MODEL 1 (STUB): Generates a story based on user data.
     * @param {object} userData - The data collected from the form.
     * @returns {Promise<string>} A string containing the generated story.
     */
    async function generateStory(userData) {
        console.log("Generating story with data:", userData);

        // Simulate AI processing time (e.g., 1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // --- TODO: Replace this fake logic with your AI API call ---
        // Example:
        // const response = await fetch('YOUR_AI_MODEL_1_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(userData)
        // });
        // const story = await response.json();
        // return story.text;
        
        // --- This is placeholder text for demonstration ---
        let storyText = `This is a story about a ${userData.age}-year-old ${userData.gender} who lives in ${userData['setting-where'] || 'their town'}. `;
        storyText += `The situation started ${userData['setting-when'] || 'one average day'}. `;
        
        if (userData.religion) {
            storyText += `Their ${userData.religion} background sometimes made them feel... [AI would elaborate here].\n\n`;
        }
        
        storyText += "One evening, while online, they received a message from a stranger... [The AI would generate the full sextortion scenario here, based on its training data].\n\n";

        if (userData.outcome === 'good') {
            storyText += "Feeling scared, they remembered what they had learned. They immediately blocked the user, told a trusted adult, and did not send anything. It was terrifying, but they knew they did the right thing, and the adult helped them report the account. [AI would provide a trauma-informed 'good' resolution].";
        } else if (userData.outcome === 'bad') {
            storyText += "Panicked, they responded to the message... [The AI would generate a 'bad' outcome, showing the potential consequences, while still being sensitive and not overly graphic, leading to a point where intervention is still possible].";
        } else {
            storyText += "What happened next was unexpected... [AI would generate a random, neutral, or surprising turn of events].";
        }
        
        return storyText;
    }


    /**
     * AI MODEL 2 (STUB): Synthesizes/discusses a story in a specific tone.
     * @param {string} storyText - The finalized story text.
     * @param {string} tone - The discussion tone selected by the user.
     * @returns {Promise<string>} A string with the AI-generated discussion.
     */
    async function synthesizeStory(storyText, tone) {
        console.log(`Synthesizing story in tone: ${tone}`);

        // Simulate AI processing time (e.g., 2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // --- THIS IS THE CRITICAL MANDATORY INFORMATION ---
        // This information should ALWAYS be included, regardless of the AI output.
        const mandatorySupportInfo =
            `\n\n==================================================\n` +
            `**Important Support & Resources:**\n` +
            `If you or someone you know is in a similar situation, please know you are not alone and help is available. \n` +
            `* **NeedHelpNow.ca:** A Canadian resource for youth to stop the spread of intimate images.\n` +
            `* **Kids Help Phone:** Call 1-800-668-6868 or text CONNECT to 686868. \n` +
            `* **Cybertip.ca:** Canada's tipline for reporting the online sexual exploitation of children.\n` +
            `* **Local Police:** If you feel you are in immediate danger, call 911.`;
        
        // --- TODO: Replace this fake logic with your AI API call ---
        // Example:
        // const response = await fetch('YOUR_AI_MODEL_2_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ story: storyText, tone: tone })
        // });
        // const discussion = await response.json();
        // return discussion.text + mandatorySupportInfo; // Append mandatory info!

        // --- This is placeholder text for demonstration ---
        let discussionText = "";
        switch(tone) {
            case 'true-crime':
                discussionText = `(Somber music fades in and out) \n"On this episode of 'The Digital Shadow,' we look at a case that's all too common. It started, as it so often does, with a simple message... [AI would narrate the story in a dramatic, 'true crime' podcast style]..."`;
                break;
            case 'news-report':
                discussionText = `(Neutral, authoritative tone) \n"Tonight, a developing story on the dangers facing teens online. We have a scenario involving a ${appState.userData.age}-year-old... [AI would read the story like a news anchor, focusing on the facts]..."`;
                break;
            case 'audiobook':
                discussionText = `(Calm, narrative voice) \n"Chapter 1. ${storyText.substring(0, 100)}... [AI would simply read the story verbatim, like an audiobook]..."`;
                break;
            case 'supportive-friend':
                discussionText = `(Warm, empathetic tone) \n"Hey, thanks for sharing that. Wow, that sounds like it was an incredibly stressful and scary situation. It makes total sense why they felt... [AI would discuss the story events from an empathetic, validating, peer perspective]..."`;
                break;
            case 'therapist':
                discussionText = `(Calm, professional, non-judgmental tone) \n"Let's unpack what happened in this story. We see the subject exhibiting a very common fear response... [AI would analyze the story using therapeutic and trauma-informed language, focusing on feelings, actions, and coping mechanisms]..."`;
                break;
        }

        // Append the mandatory support information to the AI's output
        return discussionText + mandatorySupportInfo;
    }

}); // End of DOMContentLoaded listener