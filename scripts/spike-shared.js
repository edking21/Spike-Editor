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
            20: { label: 'Class', className: 'green-circle', bubbleLabel: 'Green Class bubble' }
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
                { key: 'gettingstarted', label: 'Getting Started', match: ['get', 'gettingstarted'] }
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

                button.addEventListener('click', () => navigator.clipboard.writeText(String(snippet?.textPython || '')));
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
                    buttonText: 'move forward for 10 rotations',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `
    # move forward for 10 rotations
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * 360, 0)`
                },
                {
                    id: 'move2',
                    buttonText: 'start moving',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `
    # start moving
    motor_pair.move(motor_pair.PAIR_1, 0)`
                },
                {
                    id: 'move3',
                    buttonText: 'turn right 90 for 10 rotations',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `
    # move right 30 for 10 rotations
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, 3600, 30)
    sleep_ms(40)`
                },
                {
                    id: 'move4',
                    buttonText: 'start moving right 30',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `
    # start moving right 30
    motor_pair.move(motor_pair.PAIR_1, 30, velocity=220)
    sleep_ms(40)`
                },
                {
                    id: 'move5',
                    buttonText: 'stop moving',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `
    # stop moving
    motor_pair.stop(motor_pair.PAIR_1)
    sleep_ms(10)`
                },
                {
                    id: 'move6',
                    buttonText: 'set movement speed to 20%',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `
    # set movement speed to 20% of 1100
    movement_speed = int(0.2 * 1100)`
                },
                {
                    id: 'move7',
                    buttonText: 'set movement motors to C+D',
                    emoji: ICON_MOVEMENT,
                    color: '#FF69B4',
                    textPython: `
    # set movement motors to C+D
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)`
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
                    textPython: `
# Turn On Smiley Face For 2 Seconds
light_matrix.show_image(light_matrix.IMAGE_SMILE)
sleep(2)`
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


runloop.run(main())
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
                    textPython: `
    # wait for 1 second
    sleep(1)`
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
    await runloop.until # <your sensor here>`
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
                    buttonText: 'Training Camp1 Driving Around',
                    emoji: '🧿',
                    color: '#CC0000',
                    textPython: `# Training Camp 1 - Driving Around
import runloop, sys, motor_pair
from hub import port, motion_sensor, button
from runloop import run
from time import sleep, sleep_ms

# Constants
CM_TO_DEGREES = 21

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)


########################################################################
# 🤖 Gyro turn left 90 degrees
########################################################################
async def gyro_90_degree_turn():

    motion_sensor.reset_yaw(0)

    # turn left in place until yaw reaches 90 degrees
    motor_pair.move(motor_pair.PAIR_1, -100)
    await runloop.until(lambda: motion_sensor.tilt_angles()[0] >= 900)
    motor_pair.stop(motor_pair.PAIR_1)


########################################################################
# 🤖 when left button pressed
########################################################################
async def when_left_button_pressed():

    # wait for 1 second
    sleep(1)

    # when left button pressed
    if button.pressed(button.LEFT):
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * CM_TO_DEGREES, 0)
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES, 0)


########################################################################
# 🤖 when right button pressed
########################################################################
async def when_right_button_pressed():

    # wait for 1 second
    sleep(1)

    # pivot turn left 10 wheel rotations
    if button.pressed(button.RIGHT):
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * 360, -40)

########################################################################
# 🤖 main
########################################################################
async def main():

    runloop.run(gyro_90_degree_turn())

    while True:
        
        # Run all functions concurrently as events
        run(
            when_left_button_pressed(),
            when_right_button_pressed(),
        )

runloop.run(main())
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
from runloop import run
from time import sleep, sleep_ms

# Constants
CM_TO_DEGREES = 21

# Ports on the robot hub
color_port = port.F
distance_port = port.B
force_port = port.A

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)


########################7################################################
# ☀️ is_near - Function or condition to check if something is close
########################################################################
def is_near(distance_threshold=150): # 100mm (6 inches) minimum
    """
    Examples:
        with if            if is_near():
        with wait until    await runloop.until(is_near):
        with repeat until  while not (is_near()):
    """
    distance = distance_sensor.distance(distance_port)

    if distance == -1:
        print("Warning: Distance sensor not detecting anything")
        return False

    # print ("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))

    return distance < distance_threshold


########################################################################
# 🛑 is_color_red - Function to check if the color sensor sees red
########################################################################
def is_color_red():
    """
    Examples:
        with if             if is_red():
        with wait until     await runloop.until(is_red):
        with repeat until   while not (is_red()):
    """
    return color_sensor.color(color_port) == color.RED


########################################################################
# 🛑 is_pressed - Function to check if the force sensor pressed
########################################################################
def is_pressed():
    """
    Examples:
        with if             if is_pressed():
        with wait until     await runloop.until(is_pressed):
        with repeat until   while not (is_pressed()):
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
# 🤖 when left button pressed detect pressed
########################################################################
async def when_left_button_pressed():

    if button.pressed(button.LEFT):

        motor_pair.move(motor_pair.PAIR_1, 0)

        await runloop.until (is_pressed)

        # backup 10 cm
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES, 0)
        sleep(.2)


########################################################################
# 🤖 when right button pressed detect near
########################################################################
async def when_right_button_pressed():

    if button.pressed(button.RIGHT):

        motor_pair.move(motor_pair.PAIR_1, 0)

        await runloop.until (is_near)

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
            when_right_button_pressed(),
        )

runloop.run(main())
sys.exit()
`
                },
                {
                    id: 'gettingstarted3',
                    buttonText: 'Training Camp3 Reacting to Lines',
                    emoji: '🧿',
                    color: '#CC0000',
                    textPython: `
# Training Camp 3 - Reacting to lines
import runloop, sys, motor_pair, motor
import color, color_sensor, distance_sensor, force_sensor
from hub import port, motion_sensor,button
from runloop import run
from time import sleep, sleep_ms

# Constants
CM_TO_DEGREES = 21

# Ports on the robot hub
color_port = port.F
distance_port = port.B
force_port = port.A

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)


########################7################################################
# ☀️ is the distance sensor seeing something close
########################################################################
def is_near(distance_threshold=150): # 100mm (6 inches) minimum
    """
    Examples:
        with            code
        ------------    --------------------------
        if              if is_near():
        wait until      await runloop.until(is_near):
        wait until      await runloop.until(lambda: is_near(100)):
        repeat until    while not (is_near()):
    """
    distance = distance_sensor.distance(distance_port)

    if distance == -1:
        print("Warning: Distance sensor not detecting anything")
        return False

    # print ("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))

    return distance < distance_threshold


########################################################################
# 🛑 is the color sensor seeing red
########################################################################
def is_color_red():
    """
    Examples:
        with          code
        ------------  --------------------------
        if            if is_red():
        wait until    await runloop.until(is_red):
        repeat until  while not (is_red()):
    """
    return color_sensor.color(color_port) == color.RED


########################################################################
# 🛑 is the force sensor pressed
########################################################################
def is_pressed():
    """
    Examples:
        with if            if is_pressed():
        with wait until    await runloop.until(is_pressed):
        with repeat until  while not (is_pressed()):
    """
    return force_sensor.pressed(force_port)


########################################################################
# 🤖 Lower and raise the arm
########################################################################
async def lower_and_raise_the_arm():

    # Go shortest path to position -75 then back to0
    await motor.run_to_absolute_position(port.E, 0, 100, direction=motor.SHORTEST_PATH)
    await motor.run_to_absolute_position(port.E, -75, 100, direction=motor.SHORTEST_PATH)
    await motor.run_to_absolute_position(port.E, 0, 100, direction=motor.SHORTEST_PATH)


########################################################################
# 🤖 when left button pressed detect red line
########################################################################
async def when_left_button_pressed():

    if button.pressed(button.LEFT):

        motor_pair.move(motor_pair.PAIR_1, 0)

        await runloop.until (is_color_red)

        # backup 10 cm
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES, 0)
        sleep(.2)


########################################################################
# 🤖 when right button pressed - line follower bang bang
########################################################################
async def when_right_button_pressed():

    if button.pressed(button.RIGHT):

        # set steering to 50% of maximum
        steering = 50

        # set movement speed to 20% of maximum 1100
        speed = int(0.2 * 1100)

        # set sleep seconds to 40 milliseconds
        sleep_milliseconds = 40

        for i in range (1280):

            if is_near():

                # stop moving
                motor_pair.stop(motor_pair.PAIR_1)
                sleep_ms(2000) # sleep 2000 milliseconds (2 seconds)

            if color_sensor.color(color_port) == color.BLUE:
                motor_pair.move(motor_pair.PAIR_1, -steering, velocity=speed)
                sleep_ms(sleep_milliseconds)
            else:
                motor_pair.move(motor_pair.PAIR_1, steering, velocity=speed)
                sleep_ms(sleep_milliseconds)


########################################################################
# 🤖 main
########################################################################
async def main():

    await lower_and_raise_the_arm()

    while True:

        # Run all functions concurrently as events
        run(
            when_left_button_pressed(),
            when_right_button_pressed(),
        )

runloop.run(main())
sys.exit()
`
                },
            ]
        },
        20: {   // class
            colorClass: 'class-color',
            snippets: [
                {
                    id: 'class1',
                    buttonText: 'Class Example',
                    emoji: '🧿',
                    color: '#32CD32',
                    textPython: `
# Class example
class MyClass:
    def __init__(self, value):
        self.value = value`
                }
            ]
        }
    }
    global.SpikeShared = { ui, renderers, snippetData, bootstrapPage, colorUtils };
})(window);