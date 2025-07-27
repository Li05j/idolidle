import type { TodoBase } from '$lib/data/todo_type';
import { parseText } from '$lib/utils/utils'

type StringPair = { 1: string, 2: string}
type LogEntry = { data: StringPair, timestamp: number }

// Generate default logs for a specific action.
function createHistory() {
    const MAX_LOGS = 1000;
    const MAX_AGE_HOURS = 1;
    let _logs: LogEntry[] = $state([])

    function cleanupLogs() {
        const now = Date.now();
        const maxAge = MAX_AGE_HOURS * 60 * 60 * 1000; // MAX_AGE_HOURS hours in milliseconds
        
        // Only remove if both conditions are met
        while (_logs.length > MAX_LOGS && now - _logs[0].timestamp > maxAge) {
            _logs.shift();
        }
    }

    function addLogs(todo: TodoBase) {
        const now = new Date();
        const timestamp = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        
        let log = parseText(`_${todo.name}_ ${todo.get_spendings_rewards_string()}`)
        _logs.push({
            data: {1: timestamp, 2: log},
            timestamp: now.getTime()
        })
        
        cleanupLogs();
    }

    function addEurekaLogs(reward: string, custom_msg?: string) {
        let log = ''
        if (custom_msg) {
            log = parseText(`[red]Eureka! ${custom_msg} ${reward}![/red]`)
        }
        else {
            log = parseText(`[red]Eureka! You gained ${reward}![/red]`)
        }

        _logs.push({
            data: {1: '', 2: log},
            timestamp: Date.now()
        })
        
        cleanupLogs();
    }

    function addHintLogs(custom_msg: string, add_date: boolean = false) {
        let log = parseText(`[red]${custom_msg}[/red]`)
        
        if (add_date) {
            const now = new Date();
            const timestamp = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;

            _logs.push({
                data: {1: timestamp, 2: log},
                timestamp: Date.now()
            })
        } else {
            _logs.push({
                data: {1: '', 2: log},
                timestamp: Date.now()
            })
        }
        
        cleanupLogs();
    }

    return { 
        get logs() { return _logs.map(entry => entry.data) },
        addLogs,
        addEurekaLogs,
        addHintLogs,
    };
}

export const history = createHistory()