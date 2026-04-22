const terminal = document.querySelector('.terminal');
const fileNavigator = document.querySelector('.fileNavigator');

const terminalIcon = document.querySelector('#terminalIcon');
const fileNavigatorIcon = document.querySelector('#fileNavigatorIcon');

const terminalClose = document.querySelector('#terminalClose');
const fileNavigatorClose = document.querySelector('#fileNavigatorClose');

const commandLinePrompt = document.querySelector('#prompt');
const terminalLog = document.querySelector('.terminalLog')
const terminalBody = document.querySelector('.terminal > .windowBody');

const filesList = document.querySelector('#files');
const webFiles = document.querySelector('#webFiles');
const writingFiles = document.querySelector('#writingFiles');

// const directoryList = document.q

const webFolder = document.querySelector('#webFolder');
const writingFolder = document.querySelector('#writingFolder');

const fileNavigatorTitle = document.querySelector('#fileNavigatorTitle');

const terminalCommands = ['help', 'ls', 'cd', 'rm -rf /', 'clear'];
const refusals = [
    'I don\'t wanna',
    'Nope',
    'Not doing that',
    'No can do, buckaroo',
    'I want ice cream first',
    'Have you tried asking nicely?',
    'My lawyer advised me not to',
    'Error 403: Forbidden (by me)',
    'I\'m on my lunch break',
    'That\'s above my pay grade',
    'Absolutely not',
    'I\'d rather not, thanks',
    'Bold of you to assume I take requests',
    'The audacity...',
    'Maybe... No.',
    'Please leave a message after the beep. Beep.',
    'lol no',
    'I have a headache',
    'Did you say something? I wasn\'t listening',
];

// --- Utility ---
function updateClock() {
    const now = new Date();
    document.getElementById('taskbarTime').textContent =
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('taskbarDate').textContent =
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
updateClock();
setInterval(updateClock, 1000);

function show(el) {
    el.classList.remove('hidden');
}

function hide(el) {
    el.classList.add('hidden');
}

function updateDirectory(dir) {
    // function that adds to the directories list in the file navigator
    // root --> web/writing --> project_1/2/3.txt
}

function scrollTerminal() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function runCommand(command) {
    const terminalOutput = document.createElement('span');
    terminalOutput.classList.add('terminalOutput');

    if (command === 'help') {
        const terminalCommandDisplay = document.createElement('ul');
        for (const command of terminalCommands) {
            const terminalCommandItem = document.createElement('li');
            terminalCommandItem.classList.add('terminalCommandItem');

            terminalCommandItem.textContent = command;
            terminalCommandDisplay.append(terminalCommandItem);
            terminalOutput.append(terminalCommandDisplay);
            scrollTerminal();
        }
        terminalLog.append(terminalOutput);
        return;
    }
    else if (command === 'ls') {
        const out = document.createElement('pre');
        out.textContent = '[~]\n ├─ Web\n └─ Writing';
        terminalLog.append(out);
        scrollTerminal();
        return;
    }
    else if (command === 'rm -rf /') {
        document.querySelector('html').remove();
        return;
    }
    else if (command === 'clear') {
        if (!(terminalLog.children)) return;
        [...terminalLog.children].forEach(child => child.remove());
    }
    else if (command) {
        const out = document.createElement('p');
        out.textContent = refusals[Math.floor(Math.random() * refusals.length)];
        out.style.color = 'var(--light)';
        terminalLog.append(out);
        scrollTerminal();
        return;
    }
}

// --- Open / Close windows ---
terminalIcon.addEventListener('click', () => {
    if (terminal.classList.contains('hidden')) {
        terminal.style.left = '25%';
        terminal.style.top = '25%';
    }
    show(terminal);
    makeDraggable(terminal, document.getElementById('terminalBar'));
    commandLinePrompt.focus();
});

terminalBody.addEventListener('click', () => {
    commandLinePrompt.focus();
});

commandLinePrompt.addEventListener('keydown', (e) => {
    const command = commandLinePrompt.value;
    if (!(e.key === 'Enter')) return;
    if (terminalCommands.includes(command)) {
        runCommand(command);
        commandLinePrompt.value = '';
    } else {
        commandLinePrompt.value = '';
        const warn = document.createElement('p');
        warn.textContent = 'Invalid command (use \'help\')';
        warn.style.color = 'var(--light)';
        terminalLog.append(warn);
        scrollTerminal();
        return;
    }
    e.preventDefault();
});

terminalClose.addEventListener('click', () => hide(terminal));

fileNavigatorIcon.addEventListener('click', () => {
    if (fileNavigator.classList.contains('hidden')) {
        fileNavigator.style.left = '25%';
        fileNavigator.style.top = '25%';
    }
    show(fileNavigator);
    hide(webFiles);
    hide(writingFiles);
    show(filesList);
    fileNavigatorTitle.textContent = 'File Navigator [~]';
    makeDraggable(fileNavigator, document.getElementById('fileNavigatorBar'));
});

fileNavigatorClose.addEventListener('click', () => hide(fileNavigator));

// --- Folder navigation ---
webFolder.addEventListener('click', () => {
    hide(filesList);
    hide(writingFiles);
    show(webFiles);
    updateDirectory(webFiles);
    fileNavigatorTitle.textContent = 'File Navigator [~/web]';
});

writingFolder.addEventListener('click', () => {
    hide(filesList);
    hide(webFiles);
    show(writingFiles);
    updateDirectory(writingFiles);
    fileNavigatorTitle.textContent = 'File Navigator [~/writing]';
});

// --- Draggable windows ---
function makeDraggable(win, bar) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    bar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('terminalButton') ||
            e.target.classList.contains('fileNavigatorButton')) return;
        isDragging = true;
        offsetX = e.clientX - win.getBoundingClientRect().left;
        offsetY = e.clientY - win.getBoundingClientRect().top;
        win.style.transition = 'none';
        bar.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = (e.clientX - offsetX) + 'px';
        win.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        bar.style.cursor = 'grab';
    });
}
