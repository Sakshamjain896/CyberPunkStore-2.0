const ACTIONS = ["ACQUIRED", "UPLOADED", "INTERCEPTED", "TRADED", "LOST"];
const ITEMS = ["NEURAL LINK V2", "ARASAKA KEYCARD", "BIO-CHIP PROTOTYPE", "QUANTUM DECK", "SYNTH-LUNG"];
const LOCATIONS = ["SECTOR 7", "NIGHT CITY OUTER", "LOW ORBIT STATION", "THE STACKS", "PACIFICA"];
const CORPS = ["ARASAKA", "MILITECH", "BIOTECHNICA", "KANG TAO"];
const ALERTS = [
    "SECURITY BREACH DETECTED",
    "ACID RAIN WARNING",
    "NETWORK LATENCY SPIKE",
    "BOUNTY POSTED",
    "ILLEGAL NETRUN IN PROGRESS"
];

export const generateFeedItem = () => {
    const type = Math.random();
    
    // 30% Chance: Market Ticker
    if (type < 0.3) {
        const corp = CORPS[Math.floor(Math.random() * CORPS.length)];
        const change = (Math.random() * 5).toFixed(2);
        const isUp = Math.random() > 0.5;
        return {
            type: 'MARKET',
            text: `${corp} STOCK ${isUp ? '▲' : '▼'} ${change}%`,
            color: isUp ? '#00ff41' : '#ff2a2a'
        };
    }
    
    // 40% Chance: Transaction
    if (type < 0.7) {
        const user = `USER_${Math.floor(Math.random() * 9000) + 1000}`;
        const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        return {
            type: 'TX',
            text: `${user} // ${action} [${item}]`,
            color: 'var(--primary)' // Cyan
        };
    }
    
    // 30% Chance: World Alert
    const alert = ALERTS[Math.floor(Math.random() * ALERTS.length)];
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    return {
        type: 'ALERT',
        text: `⚠️ ${alert} // ${loc}`,
        color: '#ffae00' // Orange/Yellow
    };
};
