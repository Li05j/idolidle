import type { Todo } from '$lib/types'
import { reward_string, parseText } from '$lib/utils/utils'

type StringPair = { 1: string, 2: string}

// Generate default logs for a specific action.
function createLogs() {
    let _logs: StringPair[] = $state([])

    function addLogs(todo: Todo) {
        const now = new Date();
        const timestamp = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        
        let log = parseText(`_${todo.name}_ ${reward_string(todo.rewards)}`)
        _logs.push({1: timestamp, 2: log})
    }

    function addEurekaLogs(s: string) {
        let log = parseText(`[red]Eureka! You also gained ${s}![/red]`)
        _logs.push({1: '', 2: log})
    }

    return { 
        get logs() { return _logs },
        addLogs,
        addEurekaLogs,
    };
}

export const logs = createLogs()