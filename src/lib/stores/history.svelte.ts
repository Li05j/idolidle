import type { Todo } from '$lib/types'
import { reward_string, parseText } from '$lib/utils/utils'

type StringPair = { 1: string, 2: string}
type LogEntry = { data: StringPair, timestamp: number }

// Generate default logs for a specific action.
function createLogs() {
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

    function addLogs(todo: Todo) {
        const now = new Date();
        const timestamp = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        
        let log = parseText(`_${todo.name}_ ${reward_string(todo.rewards)}`)
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

    return { 
        get logs() { return _logs.map(entry => entry.data) },
        addLogs,
        addEurekaLogs,
    };
}

export const logs = createLogs()