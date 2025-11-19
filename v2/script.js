document.addEventListener('DOMContentLoaded', () => {

    // --- Global State ---
    const appState = {
        userData: {},
        currentStory: ""
    };

    // --- DOM Elements ---
    const screens = document.querySelectorAll('.screen');
    const storyForm = document.getElementById('story-form');
    
    // Output Elements
    const storyOutput = document.getElementById('story-output');
    const finalStoryPreview = document.getElementById('final-story-preview');
    const synthesisForm = document.getElementById('synthesis-form');
    const synthesisOutput = document.getElementById('synthesis-output');
    
    // Loading Elements
    const loadingStory = document.getElementById('loading-story');
    const loadingSynthesis = document.getElementById('loading-synthesis');

    // Navigation
    const btnModify = document.getElementById('btn-modify');
    const btnFinalize = document.getElementById('btn-finalize');
    const btnBackToStory = document.getElementById('btn-back-to-story');
    const linkResources = document.getElementById('link-resources');
    const btnBackToInput = document.getElementById('btn-back-to-input');

    // --- Helper: Navigation ---
    function showScreen(screenId) {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    // ============================================================
    //  DRAG AND DROP LOGIC
    // ============================================================
    
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');

    // 1. Setup Draggables
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', draggable.innerText);
            e.dataTransfer.effectAllowed = 'copy'; 
        });
    });

    // 2. Setup Drop Zones
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            const text = e.dataTransfer.getData('text/plain');
            
            const placeholder = zone.querySelector('.placeholder-text');
            if(placeholder) placeholder.style.display = 'none';

            // Prevent duplicate tags if desired (optional)
            // if ([...zone.children].some(child => child.innerText.includes(text))) return;

            const newTag = document.createElement('div');
            newTag.classList.add('dropped-tag');
            newTag.innerHTML = `${text} <span class="remove-tag">&times;</span>`;

            newTag.querySelector('.remove-tag').addEventListener('click', () => {
                newTag.remove();
                // Check if zone is "empty" (ignoring the placeholder element itself)
                if(zone.querySelectorAll('.dropped-tag').length === 0 && placeholder) {
                    placeholder.style.display = 'block';
                }
            });

            zone.appendChild(newTag);
        });
    });

    // ============================================================
    //  FORM SUBMISSION & AI LOGIC
    // ============================================================

    storyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingStory.style.display = 'block';
        synthesisOutput.style.display = 'none';

        // 1. Gather Standard Inputs (Gender, Outcome)
        const formData = new FormData(storyForm);
        const basicData = Object.fromEntries(formData.entries());

        // 2. Gather Dropped Items
        const traits = [];
        let detectedAge = "Unknown Age"; // Default if they forget to drag age

        document.querySelectorAll('#drop-zone-traits .dropped-tag').forEach(tag => {
            const txt = tag.innerText.replace('×', '').trim();
            
            // Logic: Check if this tag is an age (contains "years old")
            if (txt.includes("years old")) {
                detectedAge = txt.replace(" years old", "");
            } else {
                traits.push(txt);
            }
        });

        const settings = [];
        document.querySelectorAll('#drop-zone-setting .dropped-tag').forEach(tag => {
            settings.push(tag.innerText.replace('×', '').trim());
        });

        // 3. Combine Data
        appState.userData = {
            ...basicData,
            age: detectedAge, // We now get age from the tags!
            traits: traits.join(", "),
            settings: settings.join(", ")
        };

        // 4. Call AI
        appState.currentStory = await generateStory(appState.userData);
        storyOutput.textContent = appState.currentStory;
        loadingStory.style.display = 'none';
        showScreen('screen-story');
    });

    // --- Buttons & Navigation ---
    btnModify.addEventListener('click', () => showScreen('screen-input'));
    btnFinalize.addEventListener('click', () => {
        finalStoryPreview.textContent = appState.currentStory;
        showScreen('screen-synthesis');
    });
    btnBackToStory.addEventListener('click', () => showScreen('screen-story'));
    
    linkResources.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('screen-resources');
    });
    btnBackToInput.addEventListener('click', () => showScreen('screen-input'));

    // --- Synthesis Form ---
    synthesisForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingSynthesis.style.display = 'block';
        synthesisOutput.style.display = 'none';

        const selectedTone = document.getElementById('synthesis-tone').value;
        const discussion = await synthesizeStory(appState.currentStory, selectedTone);

        synthesisOutput.textContent = discussion;
        loadingSynthesis.style.display = 'none';
        synthesisOutput.style.display = 'block';
    });


    // -----------------------------------------------------------------
    // --- AI PLACEHOLDER FUNCTIONS ---
    // -----------------------------------------------------------------

    async function generateStory(data) {
        console.log("Generating with data:", data);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Logic to handle empty drag/drop fields for the demo text
        const traitText = data.traits ? `They are known for being ${data.traits}.` : "";
        const settingText = data.settings ? `The story takes place ${data.settings}.` : "The story takes place in their daily life.";

        let story = `This is a story about a ${data.age}-year-old ${data.gender}. ${traitText} ${settingText}\n\n`;
        
        story += "One day, a notification popped up on their screen... [AI generates scenario based on dropped items]...\n\n";

        if (data.outcome === 'good') {
            story += "Fortunately, they remembered the safety tips... [AI generates positive outcome].";
        } else {
            story += "Feeling overwhelmed, they made a quick decision... [AI generates challenging outcome].";
        }
        return story;
    }

    async function synthesizeStory(storyText, tone) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mandatorySupportInfo = `\n\n==================================================\n**Important Support & Resources:**\n* **NeedHelpNow.ca**\n* **Kids Help Phone:** 1-800-668-6868\n* **Cybertip.ca**\n* **Local Police: 911**`;
        
        let discussion = `[AI discusses story in ${tone} tone]: "Based on the story we just heard..."`;
        return discussion + mandatorySupportInfo;
    }

});