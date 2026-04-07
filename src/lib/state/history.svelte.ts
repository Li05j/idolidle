import { parseText } from '$lib/utils/utils'

type LogDisplay = { time: string; message: string }
type LogEntry = { display: LogDisplay; timestamp: number }

function formatTime(): string {
    const now = new Date();
    return `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
}

function createHistory() {
    const MAX_LOGS = 250;
    const MAX_AGE_MS = 1 * 60 * 60 * 1000;
    let _logs: LogEntry[] = $state([])

    function cleanupLogs() {
        const now = Date.now();
        while (_logs.length > 0 && now - _logs[0].timestamp > MAX_AGE_MS) {
            _logs.shift();
        }
        while (_logs.length > MAX_LOGS) {
            _logs.shift();
        }
    }

    function push(display: LogDisplay, timestamp: number) {
        _logs.push({ display, timestamp })
        cleanupLogs();
    }

    function addLogs(name: string, rewardText: string) {
        push(
            { time: formatTime(), message: parseText(`_${name}_ ${rewardText}`) },
            Date.now(),
        )
    }

    function addSystemLog(message: string, showTime = false) {
        push(
            { time: showTime ? formatTime() : '', message: parseText(`[red]${message}[/red]`) },
            Date.now(),
        )
    }

    return { 
        get logs() { return _logs.map(entry => entry.display) },
        addLogs,
        addSystemLog,
    };
}

export const history = createHistory()
