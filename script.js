document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const deckShapeInput = document.getElementById('deckShape');
    const widthInput = document.getElementById('width');
    const lengthInput = document.getElementById('length');
    // L-Shape Additions
    const extWidthInput = document.getElementById('extWidth');
    const extLengthInput = document.getElementById('extLength');
    // Custom Addition
    const customAreaInput = document.getElementById('customArea');

    // Sections
    const sectionMain = document.getElementById('section-main');
    const sectionExtension = document.getElementById('section-extension');
    const sectionCustom = document.getElementById('section-custom');
    const labelWidth = document.getElementById('label-width');
    const labelLength = document.getElementById('label-length');

    const postCountInput = document.getElementById('postCount');
    const postSizeInput = document.getElementById('postSize'); // New Input
    const snowTypeInput = document.getElementById('snowType');
    const depthInput = document.getElementById('depth');
    const deckTypeInput = document.getElementById('deckType');

    // Results Elements
    const resultsSection = document.getElementById('results');
    const statusIndicator = document.getElementById('status-indicator');
    const statusIcon = statusIndicator.querySelector('.status-icon');
    const statusText = statusIndicator.querySelector('.status-text');
    const snowLoadVal = document.getElementById('snowLoadVal');
    const totalWeightVal = document.getElementById('totalWeightVal');
    const loadPerPostVal = document.getElementById('loadPerPostVal');
    const recommendation = document.getElementById('recommendation');

    // Detail Stats (Capacity)
    const detailTotalCapacity = document.getElementById('detailTotalCapacity');
    const detailCurrentLoad = document.getElementById('detailCurrentLoad');

    const DENSITIES = {
        dry: 1.25, // ~15 lbs/ft3
        wet: 1.75, // ~21 lbs/ft3
        ice: 4.75  // ~57 lbs/ft3
    };

    // Conservative Load Limits for 8ft Posts (Pine/Douglas Fir)
    const POST_CAPACITY = {
        '4x4': 4300,
        '6x6': 12000
    };

    // Dead Load (Weight of deck itself)
    const DEAD_LOAD_PSF = 10;

    // Standard Residential Deck Design Load (40 Live + 10 Dead)
    const FRAMING_LIMIT_PSF = 50;

    function updateShapeVisibility() {
        const shape = deckShapeInput.value;

        // Reset everything
        sectionMain.classList.add('hidden');
        sectionExtension.classList.add('hidden');
        sectionCustom.classList.add('hidden');

        if (shape === 'rectangle') {
            sectionMain.classList.remove('hidden');
            labelWidth.textContent = 'Width (ft)';
            labelLength.textContent = 'Length (ft)';
        } else if (shape === 'l-shape') {
            sectionMain.classList.remove('hidden');
            sectionExtension.classList.remove('hidden');
            labelWidth.textContent = 'Main Width (ft)';
            labelLength.textContent = 'Main Length (ft)';
        } else if (shape === 'custom') {
            sectionCustom.classList.remove('hidden');
        }

        calculate();
    }

    function calculate() {
        const shape = deckShapeInput.value;
        const posts = parseInt(postCountInput.value) || 0;
        const postSize = postSizeInput ? (postSizeInput.value || '4x4') : '4x4';

        let area = 0;
        let isValid = false;

        // 1. Determine Area
        if (shape === 'rectangle') {
            const width = parseFloat(widthInput.value) || 0;
            const length = parseFloat(lengthInput.value) || 0;
            if (width > 0 && length > 0) {
                area = width * length;
                isValid = true;
            }
        } else if (shape === 'l-shape') {
            const mainW = parseFloat(widthInput.value) || 0;
            const mainL = parseFloat(lengthInput.value) || 0;
            const extW = parseFloat(extWidthInput.value) || 0;
            const extL = parseFloat(extLengthInput.value) || 0;
            if (mainW > 0 && mainL > 0) {
                area = (mainW * mainL) + (extW * extL);
                isValid = true;
            }
        } else if (shape === 'custom') {
            const customA = parseFloat(customAreaInput.value) || 0;
            if (customA > 0) {
                area = customA;
                isValid = true;
            }
        }

        if (!isValid || posts <= 0) {
            if (detailTotalCapacity) detailTotalCapacity.textContent = '0 lbs';
            if (detailCurrentLoad) detailCurrentLoad.textContent = '0 lbs';
            resultsSection.classList.add('hidden');
            return;
        }

        // --- 2. Calculate Capacities & Loads ---
        const depth = parseFloat(depthInput.value) || 0;
        const snowType = snowTypeInput.value;
        const deckType = deckTypeInput.value;

        // Loads
        const snowDensity = DENSITIES[snowType] || DENSITIES.dry;
        const snowLoadPsf = depth * snowDensity;
        const totalSnowWeight = area * snowLoadPsf;
        const totalDeadWeight = area * DEAD_LOAD_PSF;
        const totalLoad = totalSnowWeight + totalDeadWeight;

        // Capacity
        const singlePostCap = POST_CAPACITY[postSize] || 4300;
        const totalPostCapacity = posts * singlePostCap;

        // Framing Capacity (The deck floor itself)
        const totalFramingCapacity = area * FRAMING_LIMIT_PSF;

        // The system is only as strong as its weakest link
        const totalStructureCapacity = Math.min(totalPostCapacity, totalFramingCapacity);

        // Update Stats
        if (detailTotalCapacity) {
            let limitText = totalPostCapacity < totalFramingCapacity ? '(Posts)' : '(Framing)';
            detailTotalCapacity.textContent = `${Math.round(totalStructureCapacity).toLocaleString()} lbs ${limitText}`;
        }
        if (detailCurrentLoad) {
            detailCurrentLoad.textContent = `${Math.round(totalLoad).toLocaleString()} lbs`;
        }

        // If no snow, we can stop here (or hide results)
        if (depth <= 0) {
            resultsSection.classList.add('hidden');
            return;
        }

        // --- 3. Determine Status (Capacity vs Load) ---
        resultsSection.classList.remove('hidden');

        // Update Result Metric
        snowLoadVal.textContent = `${snowLoadPsf.toFixed(1)} psf`;
        totalWeightVal.textContent = `${Math.round(totalSnowWeight).toLocaleString()} lbs`; // Snow only here for clarity

        const loadPerPost = totalLoad / posts;
        loadPerPostVal.textContent = `${Math.round(loadPerPost).toLocaleString()} lbs`;

        statusIndicator.className = 'status';

        // Safety Ratios
        const loadRatio = totalLoad / totalStructureCapacity;

        if (loadRatio < 0.75) {
            statusIndicator.classList.add('safe');
            statusIcon.textContent = '✓';
            statusText.textContent = 'Likely Safe';
            recommendation.textContent = `Your deck is utilizing about ${(loadRatio * 100).toFixed(0)}% of its structural capacity. The estimated total load (${Math.round(totalLoad).toLocaleString()} lbs) is well within the limit of your ${posts} posts (${Math.round(totalStructureCapacity).toLocaleString()} lbs).`;
        } else if (loadRatio < 1.0) {
            statusIndicator.classList.add('caution');
            statusIcon.textContent = '!';
            statusText.textContent = 'Caution';
            recommendation.textContent = `You are nearing structural limits (${(loadRatio * 100).toFixed(0)}% capacity). Total load is ${Math.round(totalLoad).toLocaleString()} lbs, approaching your limit of ${Math.round(totalStructureCapacity).toLocaleString()} lbs. Monitor for ice buildup.`;
        } else {
            statusIndicator.classList.add('risk');
            statusIcon.textContent = '⚠️';
            statusText.textContent = 'Overloaded';
            recommendation.textContent = `CRITICAL: Estimated total load (${Math.round(totalLoad).toLocaleString()} lbs) EXCEEDS your calculated structural capacity (${Math.round(totalStructureCapacity).toLocaleString()} lbs). Risk of failure. Clear snow immediately.`;
        }

        if (deckType === 'attached' && loadRatio > 0.6) {
            recommendation.innerHTML += `<br><br><strong>Note:</strong> For attached decks, half this load sits on your house ledger. Ensure your lag screws are secure.`;
        }
    }

    // Event Listeners
    const inputs = [deckShapeInput, widthInput, lengthInput, extWidthInput, extLengthInput, customAreaInput, postCountInput, postSizeInput, snowTypeInput, depthInput, deckTypeInput];

    updateShapeVisibility();
    deckShapeInput.addEventListener('change', updateShapeVisibility);

    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculate);
            input.addEventListener('change', calculate);
        }
    });
});
