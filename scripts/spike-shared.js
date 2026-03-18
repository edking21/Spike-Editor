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
            9: { label: 'Variables', className: 'red-circle', bubbleLabel: 'Red Variables bubble' },
            10: { label: 'More Motors', className: 'blue-circle', bubbleLabel: 'Blue More Motors bubble' },
            11: { label: 'More Movement', className: 'pink-circle', bubbleLabel: 'Pink More Movement bubble' },
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
                { key: 'moremovement', label: 'More Movement', match: ['more movement', 'moremovement'] }
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
                if (idCompact.startsWith('moremotors')) return sectionRules.find(r => r.key === 'moremotors');
                if (idCompact.startsWith('moremovement')) return sectionRules.find(r => r.key === 'moremovement');
                if (id.startsWith('motor')) return sectionRules.find(r => r.key === 'motors');
                if (id.startsWith('move')) return sectionRules.find(r => r.key === 'movement');
                if (id.startsWith('light')) return sectionRules.find(r => r.key === 'light');
                if (id.startsWith('sound')) return sectionRules.find(r => r.key === 'sound');
                if (id.startsWith('ev')) return sectionRules.find(r => r.key === 'events');
                if (id.startsWith('ctrl') || id.startsWith('control')) return sectionRules.find(r => r.key === 'control');
                if (id.startsWith('sensor') || id.startsWith('fn')) return sectionRules.find(r => r.key === 'sensors');
                if (id.startsWith('op')) return sectionRules.find(r => r.key === 'operators');
                if (id.startsWith('var')) return sectionRules.find(r => r.key === 'variables');

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

                const emoji = document.createElement('span');
                emoji.className = 'emoji';
                emoji.textContent = String(snippet?.emoji || '🧿');

                const label = document.createElement('span');
                label.className = 'label';
                label.textContent = String(snippet?.buttonText || '');

                button.appendChild(emoji);
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
                    emoji: '🧿' ,
                    color: '#0066FF',
                    textPython: ` 
# Run CLOCKWISE for 1 rotation
await motor.run_for_degrees(port.E, 360, 200, direction=motor.CLOCKWISE)`
                },
                {
                    id: 'motors2',
                    buttonText: 'Go shortest path to position 0',     
                    emoji: '🧿' ,
                    color: '#0066FF',
                    textPython: ` 
# Go shortest path to position 0
await motor.run_to_relative_position(port.E, 360, 200, direction=motor.SHORTEST_PATH)`
                }
            ]
        },
        2: {   // movement
            colorClass: 'movement-color',
            snippets: [
                {
                    id: 'move1',
                    buttonText: 'move forward for 10 rotations',
                    emoji: '🧿',
                    color: '#FF69B4',
                    textPython: `
# move forward for 10cm
await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * 360, 0)`
                },
                {
                    id: 'move2',
                    buttonText: 'start moving',
                    emoji: '🧿',
                    color: '#FF69B4',
                    textPython: `
# start moving
motor_pair.move(motor_pair.PAIR_1, 0)`
                },
                {
                    id: 'move3',
                    buttonText: 'move right 30 for 10 rotations',
                    emoji: '🧿',
                    color: '#FF69B4',
                    textPython: `
# move right 30 for 10 rotations
await motor_pair.move_for_degrees(motor_pair.PAIR_1, 3600, 30)
sleep_ms(40)`
                },
                {
                    id: 'move4',
                    buttonText: 'start moving right 30',
                    emoji: '🧿',
                    color: '#FF69B4',
                    textPython: `
# start moving right 30
motor_pair.move(motor_pair.PAIR_1, 30, velocity=220)
sleep_ms(40)`
                },
                {
                    id: 'move5',
                    buttonText: 'stop moving',
                    emoji: '🧿',
                    color: '#FF69B4',
                    textPython: `
# stop moving
motor_pair.stop(motor_pair.PAIR_1)
sleep_ms(10)`
                },
                {
                    id: 'move6',
                    buttonText: 'set movement speed to 20%',
                    emoji: '🧿',
                    color: '#FF69B4',
                    textPython: `
# set movement speed to 20% of 1100
movement_speed = int(0.2 * 1100)`
                },
                {
                    id: 'move8',
                    buttonText: 'set movement motors to C+D',
                    emoji: '🧿',
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
                    buttonText: 'When',
                    emoji: '🧿',
                    color: '#FFD700',
                    textPython: `
# When
while #<your condition or function here>`
                },
                {
                    id: 'event2',
                    buttonText: 'When not',
                    emoji: '🧿',
                    color: '#FFD700',
                    textPython: `
# When not
while not (#<your condition or function here>)`
                }
            ]
        },
        6: {   // control 
            colorClass: 'control-color',
            snippets: [
                {
                    id: 'control1',
                    buttonText: 'Wait for 1 seconds',
                    emoji: '🧿',
                    color: '#DAA520',
                    textPython: `
# Wait for 1 second
sleep(1)`
                },
                {
                    id: 'control2',
                    buttonText: 'Repeat 10 times',
                    emoji: '🧿',
                    color: '#DAA520',
                    textPython: `
# Under construction - Repeat 10 times`
                },
                {
                    id: 'control33',
                    buttonText: 'Forever',
                    emoji: '🧿',
                    color: '#DAA520',
                    textPython: `
# Forever
while True:`
                },
                {
                    id: 'control4',
                    buttonText: 'If',
                    emoji: '🧿',
                    color: '#DAA520',
                    textPython: `
if # <your condition or function here>`
                },
                {
                    id: 'control5',
                    buttonText: 'Forever loop',
                    emoji: '🧿',
                    color: '#DAA520',
                    textPython: `
while True:`
                },
                {
                    id: 'control6',
                    buttonText: 'Wait until condition',
                    emoji: '🧿',
                    color: '#DAA520',
                    textPython: `
# wait until condition
await runloop.until # <your sensor condition here>`
                },
                {
                    id: 'control57',
                    buttonText: 'Repeat until (function)',
                    emoji: '🧿',
                    color: '#DAA520',
                    textPython: `
# Repeat until (function)
while # <your sensor function here>`
                }
            ]
        },
        7: {   // sensors 
            colorClass: 'sensors-color',
            snippets: [
                {
                    id: 'fn2a',
                    buttonText: 'is color red (condition)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `(is_color_red)`
                },
                {
                    id: 'fn2b',
                    buttonText: 'is pressed (condition)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `(is_pressed)`
                },
                {
                    id: 'fn3',
                    buttonText: 'is near (condition)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `(is_near)`
                },
                {
                    id: 'fn5',
                    buttonText: 'is color red (function)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `is_color_red():`
                },
                {
                    id: 'fn4',
                    buttonText: 'is pressed (function)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `is_pressed():`
                },
                {
                    id: 'fn6a',
                    buttonText: 'is near (function)',
                    emoji: '🧿',
                    color: '#87CEEB',
                    textPython: `
is_near():
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
                    id: 'op1',
                    buttonText: 'Operator Example',
                    emoji: '🧿',
                    color: '#32CD32',
                    textPython: `
# Operator example
a = 3
b = 5
result = a + b`
                }
            ]
        },
        9: {   // variables 
            colorClass: 'variables-color',
            snippets: [
                {
                    id: 'var1',
                    buttonText: 'New Variable',
                    emoji: '🧿',
                    color: '#32CD32',
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
                    id: 'move7',
                    buttonText: 'move backward for 10 rotations',
                    emoji: '🧿',
                    color: '#FF69B4',
                    textPython: `
# move backward for 10cm
await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * 360, 180)`
                }
            ]
        },
        12: {   // hints 
            colorClass: 'hints-color',
            snippets: [
                {
                    id: 'fn1',
                    buttonText: 'Getting Started',
                    emoji: '🧿',
                    color: '#CC0000',
                    textPython: `# Getting Started
import runloop, time, sys, motor_pair, motor, force_sensor, runloop
import color, color_sensor, distance_sensor
from hub import light, light_matrix, port, sound
from time import sleep, sleep_ms
from runloop import run

# Ports on the robot hub
color_port = port.A
distance_port = port.B
force_port = port.E

# Conversion constants
DEGREES_PER_CM = 21
DEGREES_PER_INCH = 53
MM_PER_INCH = 25.4

# how many times we see each color
blue_count = 0
yellow_count = 0
red_count = 0

# Color codes - these numbers represent different colors to the robot
blue = 3
yellow = 7
red = 9

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

# Remember the last color seen so we don't count the same color twice in a row
last_color = None

# This is like a stop sign for our program - when it's True, everything stops
should_stop = False

########################################################################
# 🛑 is_color_red - Function to check if the color sensor sees red
########################################################################
def is_color_red():
    return color_sensor.color(color_port) == color.RED

########################################################################
# 🎯 is_pressed - Function to check if force sensor is pressed
########################################################################
def is_pressed():
    return force_sensor.pressed(force_port)

########################################################################
# ☀️ is_near - Function to check if something is near
########################################################################
def is_near(distance_threshold=100):
    distance = distance_sensor.distance(distance_port)
    if distance == -1:
        print("Warning: Distance sensor not detecting anything")
        return False
    print("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))
    return distance < distance_threshold

########################################################################
# 🤖 Main - Start and Stop is_near test using Wait until
########################################################################
async def main():
    while True:
        motor_pair.move(motor_pair.PAIR_1, 0)
        await runloop.until(is_near)
        motor_pair.stop(motor_pair.PAIR_1)
        sleep_ms(10)

runloop.run(main())
sys.exit()`
                }
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