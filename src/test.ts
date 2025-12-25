// Test
import { EventManager } from "./EventManager";

// Define event types (highly recommended).
// You can use them either via the strict EVENT_TYPE.XXX or the "xxx" literal value.
// Suitable for both underlying and business logic, especially useful during refactoring.
const EVENT_TYPE = {
    Work: "work",
    Sleep: "sleep",
} as const;
type EVENT_TYPE = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

// Define event type mapping
interface EVENT_TYPE_MAP {
    [EVENT_TYPE.Work]: (name: string, time: number) => void;
    [EVENT_TYPE.Sleep]: (name: string, time: number) => void;
}

// Literal-based event type mapping (not recommended, but optional)
// interface EVENT_TYPE_MAP {
//     "work": (name: string, time: number) => void;
//     "sleep": (name: string, time: number) => void;
// }

// Create an event manager instance
const eventManager = new EventManager<EVENT_TYPE_MAP>();

// Listener without a context target
const onWork = (name: string, time: number) => {
    console.log(`${name} starts working, duration: ${time} minutes.`);
};
eventManager.on(EVENT_TYPE.Work, onWork);

// Listener with a context target
const target = {};
eventManager.on(EVENT_TYPE.Work, onWork, target);

// Returns the unsubscription function and event ID
const [offSleep, sleepId] = eventManager.on(EVENT_TYPE.Sleep, (name, time) => {
    console.log(`${name} starts sleeping, duration: ${time} minutes.`);
});

const info = eventManager.getStatusInfo();
console.log(info);
