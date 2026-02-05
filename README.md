# Deck Capacity Calculator

A focused web application designed to help homeowners estimate the structural safety of their residential decks under various snow and ice loads.

## ⚠️ Important Disclaimer

**This tool provides ESTIMATES ONLY.**
It is **NOT** a substitute for a professional structural assessment.
- **Capacity logic** is based on standard residential design loads (50 psf) or conservative wood post limits (e.g., 4,300 lbs for an 8' 4x4).
- It assumes your deck was originally built to standard building codes.
- Local codes, wood rot, material age, and construction quality (e.g., ledger attachments) significantly impact real-world safety.

**Always consult a licensed structural engineer** if you are concerned about your deck's safety.

## Features

- **Real-time Load Calculation**: estimates the total weight of snow/ice based on depth and density types (Dry, Wet, Ice).
- **Structural Capacity Assessment**: Calculates a "Safe Limit" based on the lesser of:
  - **Framing Design Load**: The standard 50 lbs/sq ft limit for residential deck floors.
  - **Post Capacity**: Conservative limits for standard 4x4 ($4,300 lbs) and 6x6 ($12,000 lbs) posts.
- **Safety Indicators**: Visual status (Likely Safe, Caution, Overloaded) based on the calculated load-to-capacity ratio.
- **Support for Shapes**: Standard Rectangle, L-Shape, and Custom Area inputs.

## Usage

1.  Open `index.html` in any modern web browser.
2.  Input your Deck Details:
    - **Deck Type**: Attached or Free Standing.
    - **Posts**: Number and size (defaults to 6x6).
    - **Dimensions**: Shape and size (Width/Length).
3.  Simulate Conditions:
    - **Snow Type**: Choose Dry, Wet, or Ice.
    - **Depth**: Enter the depth in inches.
4.  Review the **Status Indicator** and **Structural Capacity** stats to understand potential risks.

## Tech Stack

- **HTML5**: Semantic structure.
- **CSS3**: Modern styling with CSS variables, Flexbox/Grid, and responsive design.
- **JavaScript**: Pure Vanilla JS for real-time calculation logic.

## License

This project is for educational and informational purposes only.
