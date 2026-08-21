(function (global) {
    'use strict';

    function escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function copyTextToClipboard(text) {
        const content = String(text ?? '');
        return Promise.resolve(fallbackCopyTextToClipboard(content));
    }

    function fallbackCopyTextToClipboard(text) {
        const field = document.createElement('textarea');
        field.value = String(text ?? '');
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        field.style.pointerEvents = 'none';
        document.body.appendChild(field);

        field.focus();
        field.select();
        field.setSelectionRange(0, field.value.length);

        let succeeded = false;
        try {
            succeeded = document.execCommand('copy');
        } catch {
            succeeded = false;
        }

        field.remove();
        return succeeded;
    }

    const ICON_MOTORS = [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        ' viewBox="0 0 24 24"',
        ' width="18" height="18"',
        ' aria-hidden="true"',
        ' style="display:block;">',
        ' <circle cx="12" cy="12" r="10.5" fill="#fff7fd" stroke="#4c14c4" stroke-width="1.5"/>',
        ' <circle cx="8" cy="8" r="2.35" fill="#4c14c4"/>',
        ' <circle cx="16" cy="8" r="2.35" fill="#4c14c4"/>',
        ' <circle cx="8" cy="16" r="2.35" fill="#4c14c4"/>',
        ' <circle cx="16" cy="16" r="2.35" fill="#4c14c4"/>',
        ' <rect x="11" y="8.5" width="2" height="7" rx="1" fill="#4c14c4"/>',
        ' <rect x="8.5" y="11" width="7" height="2" rx="1" fill="#4c14c4"/>',
        '</svg>'
    ].join('');

    const ICON_MOVEMENT = [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        ' viewBox="0 0 24 24"',
        ' width="18" height="18"',
        ' aria-hidden="true"',
        ' style="display:block;">',
        ' <circle cx="12" cy="12" r="10.5" fill="#fff7fd" stroke="#c41496" stroke-width="1.5"/>',
        ' <circle cx="8" cy="8" r="2.35" fill="#c41496"/>',
        ' <circle cx="16" cy="8" r="2.35" fill="#c41496"/>',
        ' <circle cx="8" cy="16" r="2.35" fill="#c41496"/>',
        ' <circle cx="16" cy="16" r="2.35" fill="#c41496"/>',
        ' <rect x="11" y="8.5" width="2" height="7" rx="1" fill="#c41496"/>',
        ' <rect x="8.5" y="11" width="7" height="2" rx="1" fill="#c41496"/>',
        '</svg>'
    ].join('');

    const ICON_COLOR_SENSOR = [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        ' viewBox="0 0 24 24"',
        ' width="18" height="18"',
        ' aria-hidden="true"',
        ' style="display:block;">',
        ' <rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="#ffffff" stroke="#c9a300" stroke-width="1.5"/>',
        ' <circle cx="12" cy="12" r="6.25" fill="none" stroke="#c9a300" stroke-width="1.5"/>',
        ' <circle cx="12" cy="12" r="4.1" fill="#c9a300"/>',
        '</svg>'
    ].join('');

    const ICON_FORCE_SENSOR = [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        ' viewBox="0 0 24 24"',
        ' width="18" height="18"',
        ' aria-hidden="true"',
        ' style="display:block;">',
        ' <rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="#ffffff" stroke="#c9a300" stroke-width="1.5"/>',
        ' <rect x="4" y="10" width="5.8" height="4" rx="2" fill="#c9a300"/>',
        ' <rect x="14.2" y="10" width="5.8" height="4" rx="2" fill="#c9a300"/>',
        ' <circle cx="12" cy="12" r="4.6" fill="#c9a300"/>',
        ' <rect x="11.3" y="9.2" width="1.4" height="5.6" rx="0.7" fill="#ffffff"/>',
        ' <rect x="9.2" y="11.3" width="5.6" height="1.4" rx="0.7" fill="#ffffff"/>',
        '</svg>'
    ].join('');

    const ICON_DISTANCE_SENSOR = [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        ' viewBox="0 0 24 24"',
        ' width="18" height="18"',
        ' aria-hidden="true"',
        ' style="display:block;">',
        ' <rect x="1.5" y="3" width="21" height="18" rx="4" fill="#ffffff" stroke="#c9a300" stroke-width="1.5"/>',
        ' <circle cx="7" cy="12" r="3.2" fill="none" stroke="#c9a300" stroke-width="1.2"/>',
        ' <circle cx="7" cy="12" r="2" fill="#c9a300"/>',
        ' <circle cx="17" cy="12" r="3.2" fill="none" stroke="#c9a300" stroke-width="1.2"/>',
        ' <circle cx="17" cy="12" r="2" fill="#c9a300"/>',
        '</svg>'
    ].join('');

    const ICON_HEX_POINTS= '20,0 60,0 80,30 60,60 20,60 0,30';

    const ICON_HEX = [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        ' viewBox="0 0 80 60"',
        ' width="30" height="16"',
        ' aria-hidden="true"',
        ' style="transform: translateY(1px);">',
        `<polygon points="${ICON_HEX_POINTS}"`,
        ' fill="#8e7665" transform="rotate(0 0 0)"/>',
        '</svg>'
    ].join('');

    const ui = {
        toggleMobileMenu() { document.body.classList.toggle('mobile-menu-open'); },
        closeMobileMenu() { document.body.classList.remove('mobile-menu-open'); },
        searchCurrentPage() {
            const query = prompt('Search this page:');
            if (!query) return;
            const found = window.find(query, false, false, true, false, false, false);
            if (!found) alert(`No matches found for "${query}".`);
        },
        toggleDropdown(dropdownId, event) {
            if (event) event.stopPropagation();
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            const expanded = dropdown.classList.toggle('open');
            const btn = dropdown.querySelector('.menu-dropdown-toggle');
            if (btn) btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        },
        closeDropdown(dropdownId) {
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            dropdown.classList.remove('open');
            const btn = dropdown.querySelector('.menu-dropdown-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    };

    function bootstrapPage(options = {}) {
        const {
            dropdownId,
            toggleDropdownFnName,
            closeDropdownFnName
        } = options;

        // Expose common menu/search handlers for existing inline onclick hooks.
        global.toggleMobileMenu = () => ui.toggleMobileMenu();
        global.closeMobileMenu = () => ui.closeMobileMenu();
        global.searchCurrentPage = () => ui.searchCurrentPage();

        if (dropdownId && toggleDropdownFnName) {
            global[toggleDropdownFnName] = (event) => ui.toggleDropdown(dropdownId, event);
        }

        if (dropdownId && closeDropdownFnName) {
            global[closeDropdownFnName] = () => ui.closeDropdown(dropdownId);
        }

        return { ui, renderers, snippetData, colorUtils };
    }

    const colorUtils = {
        emojiByGroupId: {
            1: { label: 'Motors', className: 'blue-circle', bubbleLabel: 'Blue Motors bubble' },
            2: { label: 'Movement', className: 'pink-circle', bubbleLabel: 'Pink Movement bubble' },
            3: { label: 'Light', className: 'purple-circle', bubbleLabel: 'Purple Light bubble' },
            4: { label: 'Sound', className: 'light-purple-circle', bubbleLabel: 'Light Purple Sound bubble' },
            5: { label: 'Events', className: 'yellow-circle', bubbleLabel: 'Yellow Events bubble' },
            6: { label: 'Control', className: 'dark-yellow-circle', bubbleLabel: 'Dark Yellow Control bubble' },
            7: { label: 'Sensors', className: 'light-blue-circle', bubbleLabel: 'Light Blue Sensors bubble' },
            8: { label: 'Operators', className: 'green-circle', bubbleLabel: 'Green Operators bubble' },
            9: { label: 'Variables', className: 'orange-circle', bubbleLabel: 'Orange Variables bubble' },
            10: { label: 'More Motors', className: 'blue-circle', bubbleLabel: 'Blue More Motors bubble' },
            11: { label: 'More Movement', className: 'pink-circle', bubbleLabel: 'Pink More Movement bubble' },
            12: { label: 'Getting Started', className: 'red-circle', bubbleLabel: 'Red Getting Started bubble' },
            20: { label: 'Robot Shuffle', className: 'green-circle', bubbleLabel: 'Green Class bubble' },
            21: { label: 'Round', className: 'blue-circle', bubbleLabel: 'Blue Round bubble' },
            22: { label: 'Hay', className: 'yellow-circle', bubbleLabel: 'Yellow Hay bubble' },
            23: { label: 'Sensors', className: 'red-circle', bubbleLabel: 'Red Sensors bubble' },
            24: { label: 'Figures', className: 'green-circle', bubbleLabel: 'Green Figures bubble' }
        },
        getEmojiButton(groupId, overrides = {}) {
            const base = this.emojiByGroupId[groupId] || {};
            return {
                id: Number(groupId),
                label: overrides.label || base.label || String(groupId),
                bubbleLabel: overrides.bubbleLabel || base.bubbleLabel || '',
                className: overrides.className || base.className || ''
            };
        },
        getEmojiButtons(groupIds, overridesById = {}) {
            return (groupIds || []).map((id) => this.getEmojiButton(id, overridesById[id] || {}));
        },
        getTextColorForBackground(backgroundColor) {
            if (typeof backgroundColor !== 'string') return '#ffffff';

            const value = backgroundColor.trim();
            const hexMatch = value.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
            if (!hexMatch) return '#ffffff';

            let hex = hexMatch[1];
            if (hex.length === 3) {
                hex = hex.split('').map((c) => c + c).join('');
            }

            // Keep Control category text white for readability on dark yellow.
            if (hex.toLowerCase() === 'daa520') return '#ffffff';

            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const luminance = ((0.299 * r) + (0.587 * g) + (0.114 * b)) / 255;

            return luminance > 0.6 ? '#000000' : '#ffffff';
        },
        applySnippetTextColor(snippets) {
            return (snippets || []).map((snippet) => ({
                ...snippet,
                textColor: snippet?.textColor || this.getTextColorForBackground(snippet?.color)
            }));
        }
    };

    function showChallengeImage(imagePath, imageLabel) {
        let modal = document.getElementById('challenge-image-modal');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'challenge-image-modal';
            modal.className = 'figure-modal-backdrop';
            modal.setAttribute('aria-label', 'Challenge image');

            const panel = document.createElement('div');
            panel.className = 'figure-panel';
            panel.setAttribute('role', 'dialog');
            panel.setAttribute('aria-modal', 'true');
            panel.setAttribute('aria-label', 'Challenge 1 figure');

            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.className = 'figure-close';
            closeButton.setAttribute('aria-label', 'Close challenge image');
            closeButton.title = 'Close challenge image';
            closeButton.textContent = 'X';
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            const image = document.createElement('img');
            image.src = imagePath;
            image.alt = imageLabel;
            image.loading = 'eager';
            image.style.display = 'block';
            image.style.width = '100%';
            image.style.height = 'auto';

            panel.appendChild(closeButton);
            panel.appendChild(image);
            modal.appendChild(panel);
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
            document.body.appendChild(modal);
        }

        const image = modal.querySelector('img');
        if (image) {
            image.src = imagePath;
            image.alt = imageLabel;
        }
        modal.style.display = 'flex';
    }

    const renderers = {
        renderEmojiButtons({ containerId, buttons, onClickFnName }) {
            const host = document.getElementById(containerId);
            if (!host) return;
            host.textContent = '';

            const clickHandler = (typeof global[onClickFnName] === 'function') ? global[onClickFnName] : null;

            (buttons || []).forEach((b) => {
                const container = document.createElement('div');
                container.className = 'emoji-container';

                const button = document.createElement('button');
                button.type = 'button';
                button.classList.add('color-circle');

                String(b?.className || '')
                    .split(/\s+/)
                    .filter(Boolean)
                    .forEach((name) => button.classList.add(name));

                const id = Number(b?.id);
                button.addEventListener('click', () => {
                    if (clickHandler && Number.isFinite(id)) {
                        clickHandler(id);
                    }
                });

                const label = document.createElement('div');
                label.className = 'emoji-label';
                label.textContent = String(b?.label || '');

                container.appendChild(button);
                container.appendChild(label);
                host.appendChild(container);
            });
        },
        renderSnippetButtons({ containerId, snippets }) {
            const host = document.getElementById(containerId);
            if (!host) return;

            const shown = new Set();

            const normalize = (v) =>
                String(v || '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, ' ')
                    .trim();

            const sectionRules = [
                { key: 'motors', label: 'Motors', match: ['motor', 'motors'] },
                { key: 'movement', label: 'Movement', match: ['move', 'movement'] },
                { key: 'light', label: 'Light', match: ['light'] },
                { key: 'sound', label: 'Sound', match: ['sound', 'beep', 'audio'] },
                { key: 'events', label: 'Events', match: ['ev', 'event', 'events', 'when'] },
                { key: 'control', label: 'Control', match: ['ctrl', 'control', 'repeat', 'forever'] },
                { key: 'sensors', label: 'Sensors', match: ['sensor', 'fn', 'distance', 'color'] },
                { key: 'operators', label: 'Operators', match: ['op', 'operator', 'operators'] },
                { key: 'variables', label: 'Variables', match: ['var', 'variable', 'variables'] },
                { key: 'moremotors', label: 'More Motors', match: ['more motors', 'moremotors'] },
                { key: 'moremovement', label: 'More Movement', match: ['more movement', 'moremovement'] },
                { key: 'gettingstarted', label: 'Getting Started', match: ['get', 'gettingstarted'] },
                { key: 'hay', label: 'Hay Bale', match: ['hay', 'hay bale'] },
                { key: 'round', label: 'Round the Garage', match: ['round', 'round the'] },
                { key: 'robot', label: 'Robot Shuffle', match: ['robot', 'robot shuffle'] }
            ];

            function resolveSection(snippet) {
                const explicit = normalize(snippet?.section || snippet?.sectionLabel || snippet?.groupLabel);
                const id = normalize(snippet?.id);
                const idCompact = id.replace(/\s+/g, '');
                const text = normalize(snippet?.buttonText);

                // explicit section first
                if (explicit) {
                    const rule = sectionRules.find(r =>
                        normalize(r.label) === explicit || r.key === explicit.replace(/\s+/g, '')
                    );
                    if (rule) return rule;
                }

                // id prefix rules
                if (id.startsWith('motor')) return sectionRules.find(r => r.key === 'motors');
                if (id.startsWith('move')) return sectionRules.find(r => r.key === 'movement');
                if (id.startsWith('light')) return sectionRules.find(r => r.key === 'light');
                if (id.startsWith('sound')) return sectionRules.find(r => r.key === 'sound');
                if (id.startsWith('ev')) return sectionRules.find(r => r.key === 'events');
                if (id.startsWith('ctrl') || id.startsWith('control')) return sectionRules.find(r => r.key === 'control');
                if (id.startsWith('sensor') || id.startsWith('fn')) return sectionRules.find(r => r.key === 'sensors');
                if (id.startsWith('op')) return sectionRules.find(r => r.key === 'operators');
                if (id.startsWith('var')) return sectionRules.find(r => r.key === 'variables');
                if (idCompact.startsWith('moremotors')) return sectionRules.find(r => r.key === 'moremotors');
                if (idCompact.startsWith('moremovement')) return sectionRules.find(r => r.key === 'moremovement');
                if (idCompact.startsWith('gettingstarted')) return sectionRules.find(r => r.key === 'gettingstarted');

                // fallback text match
                return sectionRules.find(rule =>
                    rule.match.some(token =>
                        text.startsWith(token) || text.includes(` ${token}`) || id.includes(token)
                    )
                );
            }

            host.textContent = '';

            (snippets || []).forEach((snippet) => {
                const section = resolveSection(snippet);
                if (section && !shown.has(section.key)) {
                    shown.add(section.key);

                    const sectionLabel = document.createElement('div');
                    sectionLabel.className = 'snippet-group-label';
                    sectionLabel.textContent = section.label;
                    host.appendChild(sectionLabel);
                }

                const snippetContainer = document.createElement('div');
                snippetContainer.className = 'snippet';

                const button = document.createElement('button');
                button.type = 'button';
                button.style.backgroundColor = String(snippet?.color || '#666');
                button.style.color = String(snippet?.textColor || '#fff');

                const emojiText = String(snippet?.emoji ?? '🧿');

                const label = document.createElement('span');
                label.className = 'label';
                const buttonText = String(snippet?.buttonText || '');
                if (buttonText.includes('<svg')) {
                    // label.style.whiteSpace = 'pre';
                    label.innerHTML = buttonText;
                } else {
                    label.textContent = buttonText;
                }

                button.addEventListener('click', () => {
                    if (snippet?.id === 'challenge1') {
                        copyTextToClipboard(snippet?.textPython || '');
                        return;
                    }
                    if (snippet?.id === 'challenge7') {
                        copyTextToClipboard(snippet?.textPython || '');
                        return;
                    }
                    if (snippet?.id === 'challenge2') {
                        showChallengeImage('./images/Challenge 1 Figure.jpg', 'Challenge 1 Figure');
                        return;
                    }
                    if (snippet?.id === 'challenge4') {
                        showChallengeImage('./images/Challenge 2 Figure.jpg', 'Challenge 2 Figure');
                        return;
                    }
                    if (snippet?.id === 'challenge6') {
                        showChallengeImage('./images/Challenge 3 Figure .jpg', 'Challenge 3 Figure');
                        return;
                    }
                    if (snippet?.id === 'challenge8') {
                        showChallengeImage('./images/Challenge 4 Figure.jpg', 'Challenge 4 Figure');
                        return;
                    }
                    copyTextToClipboard(snippet?.textPython || '');
                });
                if (emojiText) {
                    const emoji = document.createElement('span');
                    emoji.className = 'emoji';
                    if (emojiText.includes('<svg')) {
                        emoji.innerHTML = emojiText;
                    } else {
                        emoji.textContent = emojiText;
                    }
                    button.appendChild(emoji);
                }
                button.appendChild(label);
                snippetContainer.appendChild(button);
                host.appendChild(snippetContainer);
            });
        }
    };

    const snippetData = {
        1: {   // motors
            colorClass: 'motors-color',
            snippets: [
                {
                    id: 'motors1',
                    buttonText: 'Run CLOCKWISE for 1 rotation',     
                    emoji: ICON_MOTORS ,
                    color: '#0066FF',
                    textPython: ` 
    # Run CLOCKWISE for 1 rotation
    await motor.run_for_degrees(port.E, 360, 200, direction=motor.CLOCKWISE)`
                },
                {
                    id: 'motors2',
                    buttonText: 'Go shortest path to position 0',     
                    emoji: ICON_MOTORS ,
                    color: '#0066FF',
                    textPython: ` 
    # Go shortest path to position 0
    await motor.run_to_absolute_position(port.E, 0, 100, direction=motor.SHORTEST_PATH)`
                }
            ]
        },
        2: {   // movement
            colorClass: 'movement-color',
            snippets: [
                {
                    id: 'move1',
                    buttonText: 'move forward for 10 cm at 50% speed',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `    await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * int(360/17.5), 0, velocity=int(.5 * 1100))
`
                },
                {
                    id: 'move2',
                    buttonText: 'start moving',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `    motor_pair.move(motor_pair.PAIR_1, 0)
`
                },
                {
                    id: 'move3',
                    buttonText: 'turn right 90 degrees',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `    await motor_pair.move_for_degrees(motor_pair.PAIR_1, 180, 100)
`
                },
                {
                    id: 'move4',
                    buttonText: 'start moving right 30',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `    motor_pair.move(motor_pair.PAIR_1, 30, velocity=220) 
`
                },
                {
                    id: 'move5',
                    buttonText: 'stop moving',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `    motor_pair.stop(motor_pair.PAIR_1)
`
                },
                {
                    id: 'move6',
                    buttonText: 'set movement speed to 20%',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `    movement_speed = int(0.2 * 1100)
`
                },
                {
                    id: 'move7',
                    buttonText: 'set movement motors to C+D',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `
    # set movement motors to C+D
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)
`
                }
            ]
        },
        3: {   // light 
            colorClass: 'light-color',
            snippets: [
                {
                    id: 'light1',
                    buttonText: 'Turn On Smiley Face For 2 Seconds',
                    emoji: '🧿',
                    color: '#8A2BE2',
                    textPython: `    light_matrix.show_image(light_matrix.IMAGE_SMILE)
    sleep(2)
`
                },
                {
                    id: 'light2',
                    buttonText: 'Blinking Eyes',
                    emoji: '🧿',
                    color: '#8A2BE2',
                    textPython: `
# Blinking Eyes on the light matrix
blinking_eyes()`
                },
                {
                    id: 'light3',
                    buttonText: 'Turn On Angry Face For 2 Seconds',
                    emoji: '🧿',
                    color: '#8A2BE2',
                    textPython: `
# Turn On Angry Face For 2 Seconds
light_matrix.show_image(light_matrix.IMAGE_ANGRY)
sleep(2)`
                },
                {
                    id: 'light4',
                    buttonText: 'Light Matrix Write (debug)',
                    emoji: '🧿',
                    color: '#8A2BE2',
                    textPython: `
light_matrix.write('<step number here>')`
                }
            ]
        },
        4: {   // sound
            colorClass: 'sound-color',
            snippets: [
                {
                    id: 'sound1',
                    buttonText: 'play beep for 60 for 0.2 seconds',
                    emoji: '🔊',
                    color: '#a564e1',
                    textPython: `
# play sound for 0.2 seconds
await sound.beep(60, 200)`
                }
            ]
        },
        5: {   // events 
            colorClass: 'events-color',
            snippets: [
                {
                    id: 'event1',
                    buttonText: 'When Training Camp1 starts',
                    emoji: '',
                    color: '#FFD700',
                    textPython: `
from hub import light_matrix, port
import runloop, motor_pair, sys

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

# conversion units
DEGREES_PER_CM = 21
DEGREES_PER_IN = 53

########################################################################
# 🤖 Main - Training Camp #1 Moving Arround
########################################################################
async def main():

    await light_matrix.write("Hi!")

    # move forward at 200 degrees/sec for 10cm
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * DEGREES_PER_CM, 0, velocity=200)

    # move backward at 300 degrees/sec for 10cm
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * DEGREES_PER_CM, 0, velocity=300)


run(main())
sys.exit()
`
                },
                {
                    id: 'event2',
                    buttonText: 'When program starts',
                    emoji: '',
                    color: '#FFD700',
                    textPython: `

########################################################################
# 🤖 Main - Training Camp #2 Playing with objects
########################################################################
async def main():

    # Connect two motors together so they work as a team
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

    # <Paste your code here>
`
                },
                {
                    id: 'event4',
                    buttonText: 'When color is red',
                    emoji: ICON_COLOR_SENSOR,
                    color: '#FFD700',
                    textPython: `
# When left button pressed
while not (#<your condition or function here>)`
                },
                {
                    id: 'event3',
                    buttonText: 'When closer than 10 cm',
                    emoji: ICON_DISTANCE_SENSOR,
                    color: '#FFD700',
                    textPython: `
    # When closer than
    while not is_near()`
                },
                {
                    id: 'event5',
                    buttonText: 'When left button pressed',
                    emoji: ICON_FORCE_SENSOR,
                    color: '#FFD700',
                    textPython: `
# When left button pressed
while not (#<your condition or function here>)`
                },
                {
                    id: 'event6',
                    buttonText: 'When',
                    emoji: '🧿',
                    color: '#FFD700',
                    textPython: `
# When 
when`
                },
            ]
        },
        6: {   // control 
            colorClass: 'control-color',
            snippets: [
                {
                    id: 'control1',
                    buttonText: 'Wait 1 seconds',
                    emoji: '',
                    color: '#DAA520',
                    textPython: `    sleep(1)
`
                },
                {
                    id: 'control2',
                    buttonText: 'Repeat 10',
                    emoji: '🧿',
                    color: '#DAA520',
                    textPython: `
    # Repeat 10 times
    for i in range(10):
         # <your code here>`
                },
                {
                    id: 'control3',
                    buttonText: 'Forever',
                    emoji: '🧿',
                    color: '#DAA520',
                    textPython: `
    # Forever
    while True:`
                },
                {
                    id: 'control2',
                    buttonText: `if    ${ICON_HEX} then`,
                    emoji: '',
                    color: '#DAA520',
                    textPython: `
    # wait until 
    await until # <your sensor here>`
                },
                {
                    id: 'control3',
                    buttonText: `repeat until    ${ICON_HEX} `,
                    emoji: '',
                    color: '#DAA520',
                    textPython: `
    # Repeat until
    while # <your sensor here>`
                },
                {
                    id: 'control6',
                    buttonText: `repeat until    ${ICON_HEX} `,
                    emoji: '',
                    color: '#DAA520',
                    textPython: `
    if # <your condition or function here>`
                },
            ]
        },
        7: {   // sensors 
            colorClass: 'sensors-color',
            snippets: [
                {
                    id: 'sensor1',
                    buttonText: 'is color red (condition)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `(is_color_red)`
                },
                {
                    id: 'sensor2',
                    buttonText: 'is pressed (condition)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `(is_pressed)`
                },
                {
                    id: 'sensor3',
                    buttonText: 'is near (condition)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `(is_near)`
                },
                {
                    id: 'sensor4',
                    buttonText: 'is color red (function)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `is_color_red():`
                },
                {
                    id: 'sensor5',
                    buttonText: 'is pressed (function)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `is_pressed():`
                },
                {
                    id: 'sensor6',
                    buttonText: 'is near (function)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `is_near():
    # your code here`
                },
                {
                    id: 'fn6b',
                    buttonText: 'relative position reset',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `
# Reset relative position to 0
motor.reset_relative_position(port.A, 0)`
                },
                {
                    id: 'fn6c',
                    buttonText: 'relative position (function)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `
(motor.relative_position(port.D) > 1000):
    # <Your code here>`
                }
            ]
        },
        8: {   // operators 
            colorClass: 'operators-color',
            snippets: [
                {
                    id: 'oper1',
                    buttonText: 'Operator Example',
                    emoji: '🧿',
                    color: '#32CD32',
                    textPython: `
# Operator example
a = 3
b = 5
result = a + b`
                },
                {
                    id: 'oper2',
                    buttonText: 'Operator Example',
                    emoji: '🧿',
                    color: '#32CD32',
                    textPython: `
# Operator example
a = 3
b = 5
result = a + b`
                },
                {
                    id: 'oper3',
                    buttonText: 'Operator Example',
                    emoji: '🧿',
                    color: '#32CD32',
                    textPython: `
# Operator example
a = 3
b = 5
result = a + b`
                },
            ]
        },
        9: {   // variables 
            colorClass: 'variables-color',
            snippets: [
                {
                    id: 'var1',
                    buttonText: 'New Variable',
                    emoji: '🧿',
                    color: '#d8a22d',
                    textPython: `
# variable example
a = 0
`
               }
            ]
        },
        10: {   // More Motors
            colorClass: 'moremotors-color',
            snippets: [
                {
                    id: 'moremotors1',
                    buttonText: 'Run motor E at 50% power',
                    emoji: '🧿' ,
                    color: '#0066FF',
                    textPython: `
# Run motor E at 50% power
motor.run(port.E, 550)`
                }
            ]
        },
        11: {   // More Movement
            colorClass: 'movement-color',
            snippets: [
                {
                    id: 'moremovement1',
                    buttonText: 'move backward for 10 rotations',
                    emoji: '🧿',
                    color: '#FF69B4',
                    textPython: `
# move backward for 10cm
await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * 360, 180)`
                }
            ]
        },
        12: {   // Getting Started 
            colorClass: 'gettingstarted-color',
            snippets: [
                {
                    id: 'gettingstarted1',
                    buttonText: 'Training Camp1 Getting Started',
                    emoji: '🧿',
                    color: '#CC0000',
                    textPython: `# Training Camp 1 - Getting Started
import motor_pair, sys
from hub import port, light_matrix
from runloop import run
from time import sleep

# Conversions
CM_TO_DEGREES = 21
INCHES_TO_DEGREES = 53

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)


########################################################################
# 🤖 main
########################################################################
async def main():
    
    await light_matrix.write("Hi!")

run(main())
sys.exit()
`
                },
                {
                    id: 'gettingstarted2',
                    buttonText: 'Training Camp2 Playing with objects',
                    emoji: '🧿',
                    color: '#CC0000',
                    textPython:`# Training Camp 2 - Playing with objects
import runloop, sys, motor_pair, motor
import color, color_sensor, distance_sensor, force_sensor
from hub import port, motion_sensor,button
from runloop import run, until
from time import sleep, sleep_ms

# Constants
CM_TO_DEGREES = 21
INCHES_TO_DEGREES = 53

# Sensor Ports
force_port = port.A
distance_port = port.B
color_port = port.F

# Motor Ports
left_motor = port.C
right_motor = port.D
arm_motor = port.E

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, left_motor, right_motor)


#########################$##############################################
# ☀️ is the distance sensor seeing something close
########################################################################
def is_near(distance_threshold=100): # 100mm (3.937 inches)
    """
    Examples:
        if..                    if is_near():
        repeat until            while not (is_near()):
        repeat until lambda.    while not (lambda: is_near(150)): # use lambda to override 100
        wait until..            await until (is_near()):
        wait until lambda...    await until (lambda: is_near(150)): # use lambda to override 100
    """
    distance = distance_sensor.distance(distance_port)

    if distance == -1:
        print("Warning: Distance sensor not detecting anything")
        return False

    # print ("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))

    return distance < distance_threshold


########################################################################
# 🛑 is_color_blue - Function to check if the color sensor sees red
########################################################################
def is_color_blue():
    """
    Examples:
        if..                    if is_blue():
        repeat until            while not (is_blue()):
        wait until..            await until (is_blue()):
    """
    return color_sensor.color(color_port) == color.RED


########################################################################
# 🛑 is_pressed - Function to check if the force sensor pressed
########################################################################
def is_pressed():
    """
    Examples:
        with if             if is_pressed():
        with wait until     await until(is_pressed):
        with repeat until   while not (is_pressed()):
    """
    """
    Examples:
        if..                    if is_presses():
        repeat until            while not (is_presses()):
        wait until..            await until (is_presses()):
    """
    return force_sensor.pressed(force_port)


########################################################################
# 🤖 Lower and raise the arm
########################################################################
async def lower_and_raise_the_arm():

    # Go shortest path to position -75 then to back to 0
    await motor.run_to_absolute_position(port.E, 0, 100, direction=motor.SHORTEST_PATH)
    await motor.run_to_absolute_position(port.E, -75, 100, direction=motor.SHORTEST_PATH)
    await motor.run_to_absolute_position(port.E, 0, 100, direction=motor.SHORTEST_PATH)


########################################################################
# 🤖 when force sensor pressed 
########################################################################
async def when_force_sensor_pressed():

    if button.pressed(button.LEFT):

        motor_pair.move(motor_pair.PAIR_1, 0)

        await until (is_pressed)

        # backup 10 cm
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES, 0)
        sleep(.2)


########################################################################
# 🤖 when right button pressed detect near
########################################################################
async def when_right_button_pressed():

    if button.pressed(button.RIGHT):

        motor_pair.move(motor_pair.PAIR_1, 0)

        await until (is_near)

        # backup 10 cm
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES, 0)
        sleep(.2)


########################################################################
# 🤖 main
########################################################################
async def main():

    await lower_and_raise_the_arm()

    while True:

        # Run all functions concurrently as events
        run(
            when_left_button_pressed(),
            when_force_sensor_pressed(),
        )

run(main())
sys.exit()
`
                },
                {
                    id: 'gettingstarted3',
                    buttonText: 'Training Camp3 Reacting to Lines',
                    emoji: '🧿',
                    color: '#CC0000',
                    textPython: `# Training Camp 3 - Reacting to lines
import sys, motor_pair, motor
import color, color_sensor, distance_sensor, force_sensor
from hub import port, motion_sensor,button
from runloop import run, until
from time import sleep, sleep_ms

# Constants
CM_TO_DEGREES = 21
INCHES_TO_DEGREES = 53

# Sensor ports
force_port = port.A
distance_port = port.B
color_port = port.F

# Motor Ports
left_motor = port.C 
right_motor = port.D 
arm_motor = port.E 

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, left_motor, right_motor)


########################################################################
# ☀️ is the distance sensor seeing something close
########################################################################
def is_near(distance_threshold=100): # 100mm (3.937 inches) 
    """
    Examples:
        if..                    if is_near():
        repeat until            while not (is_near()):
        repeat until lambda.    while not (lambda: is_near(150)): # use lambda to override 100
        wait until..            await until (is_near()):
        wait until lambda...    await until (lambda: is_near(150)): # use lambda to override 100
    """
    distance = distance_sensor.distance(distance_port)

    if distance == -1:
        print("Warning: Distance sensor not detecting anything")
        return False

    # print ("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))

    return distance < distance_threshold


########################################################################
# 🛑 is the color sensor seeing blue
########################################################################
def is_blue():
    """
    Examples:
        if                  if is_blue():
        wait until          await until(is_blue):
        repeat until        while not (is_blue()):
    """
    return color_sensor.color(color_port) == color.BLUE


########################################################################
# 🛑 is the force sensor pressed
########################################################################
def is_pressed():
    """
    Examples:
        if                  if is_pressed():
        wait until          await until(is_pressed):
        repeat until        while not (is_pressed()):
    """
    return force_sensor.pressed(force_port)


########################################################################
# 🤖 when_right_button_pressed Lower and raise the arm
########################################################################
async def when_right_button_pressed():

    if button.pressed(button.RIGHT):

        velocity = 100      # degrees per second

        # Go shortest path to position -40 degrees then back to 0
        await motor.run_to_absolute_position(arm_motor, 0, velocity, direction=motor.SHORTEST_PATH)
        await motor.run_to_absolute_position(arm_motor, -40, velocity, direction=motor.SHORTEST_PATH)
        sleep_ms(200)
        await motor.run_to_absolute_position(arm_motor, 0, velocity, direction=motor.SHORTEST_PATH)


########################################################################
# 🤖 when left button pressed detect blue line
########################################################################
async def when_left_button_pressed():

    if button.pressed(button.LEFT):

        motor_pair.move(motor_pair.PAIR_1, 0)

        await until (is_blue)

        # backup 10 cm
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES, 0)
        sleep(.2)


########################################################################
# 🤖 line follower bang bang
########################################################################
async def line_follower_bang_bang():

    steering = 50              # set steering to 50 for line following 
    speed    = int(0.2 * 1100) # set speed to 20% of max speed
    sleep_milliseconds = 40    # sleep for 40 milliseconds between each check of the color sensor

    for i in range (100):      # run for 100 iterations (this number controls when to stop)

        if is_near():          # if hand wave stop moving for 2 seconds
            motor_pair.stop(motor_pair.PAIR_1)
            sleep_ms(2000)     # sleep 2000 milliseconds (2 seconds)

        if is_blue():          # if on the line turn right
            motor_pair.move(motor_pair.PAIR_1, -steering, velocity=speed)
            sleep_ms(sleep_milliseconds)

        else:                  # if off the line turn left
            motor_pair.move(motor_pair.PAIR_1, steering, velocity=speed)
            sleep_ms(sleep_milliseconds)
        
    motor_pair.stop(motor_pair.PAIR_1)

########################################################################
# 🤖 main
########################################################################
async def main():

    await line_follower_bang_bang()

    while True:

        # Run all functions concurrently as events
        run(
            when_left_button_pressed(),
            when_right_button_pressed(),
        )

run(main())
sys.exit()
`
                },
            ]
        },
        20: {   // robot shuffle
            colorClass: 'challenge-color',
            snippets: [
                {
                    id: 'challenge1',
                    buttonText: 'Robot Shuffle Description',
                    emoji: '🧿',
                    color: '#32CD32',
                    textPython: `
    # 1. Move from the Start Line to Line 4, 78 cm from the Start Line, at 50% speed.

    # 2. Wait 2 seconds.

    # 3. Move to Line 2, 38 cm from the Start Line, at 25% speed.

    # 4. Move forward 20 cm to Line 3 at 75% speed.

    # 5. Wait 2 seconds.

    # 6. Move forward at 50% speed and stop on line 4.

    # 7. Wait 2 seconds.

    # 8. Move backwards at 75% speed and stop on the Start Line.

    # 9. Display a smiley face.
`
                },
                {
                    id: 'challenge2',
                    buttonText: 'Robot Shuffle Figure',
                    emoji: '🧿',
                    color: '#32CD32',
                    textPython: `
test for figures
`
                },
            ]
        },
        21: {   // round the garage
            colorchallenge: 'challenge-color',
            snippets: [
                {
                    id: 'challenge3',
                    buttonText: 'Round the Garage Description',
                    emoji: '🧿',
                    color: '#0066FF',
                    textPython: `
    # 1. Move from the Start Line to Line 4, 78 cm from the Start Line, at 50% speed.

    # 2. Wait 2 seconds.

    # 3. Move to Line 2, 38 cm from the Start Line, at 25% speed.

    # 4. Move forward 20 cm to Line 3 at 75% speed.

    # 5. Wait 2 seconds.

    # 6. Move forward at 50% speed and stop on line 4.

    # 7. Wait 2 seconds.

    # 8. Move backwards at 75% speed and stop on the Start Line.

    # 9. Display a smiley face.
`
                },
                {
                    id: 'challenge4',
                    buttonText: 'Round the Garage Figure',
                    emoji: '🧿',
                    color: '#0066FF',
                    textPython: `
test for figures
`
                },
            ]
        },
        22: {   // hay bale
            colorClass: 'challenge-color',
            snippets: [
                {
                    id: 'challenge5',
                    buttonText: 'Hay Bale Description',
                    emoji: '🧿',
                    color: '#FFD700',
                    textPython: `
    # 1. Move from the Start Line to Line 4, 78 cm from the Start Line, at 50% speed.

    # 2. Wait 2 seconds.

    # 3. Move to Line 2, 38 cm from the Start Line, at 25% speed.

    # 4. Move forward 20 cm to Line 3 at 75% speed.

    # 5. Wait 2 seconds.

    # 6. Move forward at 50% speed and stop on line 4.

    # 7. Wait 2 seconds.

    # 8. Move backwards at 75% speed and stop on the Start Line.

    # 9. Display a smiley face.
`
                },
                {
                    id: 'challenge6',
                    buttonText: 'Hay Bale Figure',
                    emoji: '🧿',
                    color: '#FFD700',
                    textPython: `
test for figures
`
                },
            ]
        },
        23: {   // sensor
            colorClass: 'challenge-color',
            snippets: [
                {
                    id: 'challenge7',
                    buttonText: 'Sensors Description',
                    emoji: '🧿',
                    color: '#CC0000',
                    textPython: `
    # 1. The Driving Base tires are placed in the center of a 12” by 12” taped square at the bottom right corner of a 4’ by 4’ table surrounded by walls.

    # 2. The Driving Base moves forward toward the top wall of the table. 
    #    When the force sensor is pressed, the Driving Base moves backward 6”, then waits for 2 seconds.

    # 3. The Driving Base then turns left 90 degrees and moves forward until it is 10” from the left wall of the table.

    # 4. The Driving Base turns 90 degrees to the left, moves forward toward the bottom wall of the table, 
    #    and moves backward 4” when the force sensor is pressed.

    # 5. The Hub displays a frowny face, and the Driving Base waits for 2 seconds.

    # 6. The Driving Base turns 90 degrees to the left and moves forward 10 in, then backwards 10 in, 
    #    then repeats this movement (back and forth) until the judge waves his hand in front of the robot (6” or less) and the robot stops.

    # 7. The student then depresses the force sensor, and after a four second delay, 
    #    the robot moves forward toward the right wall of the table.

    # 8. Using the color sensor, when the Driving Base enters the 12” by 12” taped square, 
    #    it turns 90 degrees to the left to face the top wall. The Driving Base must finish inside the taped square without touching the tape.

`
                },
                {
                    id: 'challenge8',
                    buttonText: 'Sensors Figure',
                    emoji: '🧿',
                    color: '#CC0000',
                    textPython: `
test for figures
`
                },
            ]
        },
    };

    global.SpikeShared = { ui, renderers, snippetData, bootstrapPage, colorUtils };
})(window);