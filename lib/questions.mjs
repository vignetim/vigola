import { questionVariants } from './question-variants.mjs';

// Difficulty values match the Turkish host editor; all quiz content is English.
const make = (letter, category, text, answer, explanation, difficulty = 'Kolay', code = '') => ({ id: letter.toLowerCase(), letter, category, text, answer, explanation, difficulty, code, points: 100, penalty: difficulty === 'Zor' ? 50 : difficulty === 'Orta' ? 30 : 25, multiplier: difficulty === 'Zor' ? 2 : difficulty === 'Orta' ? 1.5 : 1 });
export const questions = [
 make('A', 'Web development', 'A weather app requests forecasts from another service through a documented interface. What three-letter term names that interface?', 'API', 'An Application Programming Interface defines how software components can request data or operations.'),
 make('B', 'Algorithms', 'You search a sorted list by checking its middle item and discarding half the remaining candidates each time. Which algorithm is this?', 'Binary search', 'Binary search halves the search interval on each step, taking O(log n) comparisons.', 'Orta'),
 make('C', 'Performance', 'An application keeps a reusable copy of an expensive query result to serve the next request faster. What is this temporary store called?', 'Cache', 'A cache reuses previously fetched or computed data; an expiration or invalidation policy keeps it useful.'),
 make('D', 'Concurrency', 'Two threads each hold a lock that the other needs, and neither can proceed. What is this situation called?', 'Deadlock', 'A circular wait for resources can stop all participating threads from making progress.', 'Orta'),
 make('E', 'Programming', 'A BankAccount exposes deposit() but prevents callers from changing its balance directly. Which object-oriented principle does this demonstrate?', 'Encapsulation', 'Encapsulation groups state with behavior and controls access to internal details.', 'Orta'),
 make('F', 'Delivery', 'A team deploys a new checkout screen but enables it only for selected users through a configuration switch. What is that switch called?', 'Feature flag', 'Feature flags separate deploying code from enabling its behavior for users.'),
 make('G', 'Web development', 'A client asks for only a user name and avatar using a typed query schema. Which API query language supports this?', 'GraphQL', 'GraphQL lets clients select fields from a schema rather than receiving a fixed response shape.', 'Orta'),
 make('H', 'Data structures', 'You store users by ID in buckets chosen by a hashing function. Which key-value data structure are you using?', 'Hash map', 'Hash maps associate keys with values and offer average O(1) lookup with suitable hashing.', 'Orta'),
 make('I', 'Databases', 'A database avoids scanning every customer row by consulting an extra lookup structure on email. What is that structure called?', 'Index', 'An index speeds up selected reads at the cost of storage and extra work on writes.', 'Orta'),
 make('J', 'Data formats', 'An HTTP response contains {"online":true,"players":4}. Which text-based data format is this?', 'JSON', 'JavaScript Object Notation represents objects, arrays, strings, numbers, booleans, and null.'),
 make('K', 'Infrastructure', 'A cluster must keep three replicas of a container running and replace failed pods. Which orchestration platform manages this?', 'Kubernetes', 'Kubernetes controllers reconcile the current cluster state with the declared desired state.', 'Orta'),
 make('L', 'Networking', 'Incoming requests are distributed across several healthy application servers. What component performs this routing?', 'Load balancer', 'A load balancer spreads traffic across backends and can avoid unhealthy instances.'),
 make('M', 'Performance', 'A recursive function remembers its output for each input so repeated calls avoid the same calculation. What technique is this?', 'Memoization', 'Memoization caches function results by their inputs.', 'Orta'),
 make('N', 'Programming', 'A C program dereferences a pointer whose value represents no object, causing undefined behavior. What kind of pointer is it?', 'Null pointer', 'A null pointer does not point to a valid object and must not be dereferenced.', 'Orta'),
 make('O', 'Security', 'A calendar app receives delegated access to your account without learning your password. Which authorization framework enables this?', 'OAuth', 'OAuth supports delegated authorization through access tokens; it is not itself an authentication protocol.', 'Orta'),
 make('P', 'Web development', 'An endpoint returns 20 products at a time and provides a way to request the next group. What technique divides the results this way?', 'Pagination', 'Pagination splits a result set into smaller pages, often using offsets or cursors.'),
 make('R', 'Databases', 'A transfer fails halfway through a database transaction. Which operation cancels its uncommitted changes?', 'Rollback', 'A rollback abandons uncommitted changes so a failed transaction does not partially take effect.'),
 make('S', 'Data structures', 'An undo history removes the most recently added operation first. Which LIFO data structure fits this behavior?', 'Stack', 'A stack pushes and pops items at the same end.'),
 make('T', 'Databases', 'A debit and a credit must either both succeed or both be canceled. What groups these database operations into one unit?', 'Transaction', 'A transaction groups operations under guarantees such as atomicity and isolation.'),
 make('U', 'Testing', 'A test checks one price-calculation function while replacing its external dependencies. What type of test is this?', 'Unit test', 'A unit test checks a small unit of behavior in isolation from external systems.'),
 make('V', 'Developer tools', 'Your team needs to inspect past edits, work on branches, and restore earlier revisions. What general kind of system provides this?', 'Version control', 'Version control records changes over time and supports collaboration through revisions and branches.'),
 make('W', 'Networking', 'A browser and server exchange messages in both directions over one persistent connection. Which web protocol supports this?', 'WebSocket', 'WebSocket provides bidirectional messaging after the connection is established.', 'Orta'),
 make('Y', 'Software design', 'A teammate rejects building a speculative plugin system until a real requirement appears. Which acronym means "You Aren\'t Gonna Need It"?', 'YAGNI', 'YAGNI discourages implementing features before they are needed.'),
 make('Z', 'Security', 'Attackers exploit a vulnerability before a fix is available and before defenders have had time to prepare. What term describes this kind of exploit?', 'Zero-day', 'A zero-day exploit targets a vulnerability for which defenders have had no advance opportunity to deploy a fix.', 'Orta'),
];

const easyAnswers = new Set([
 'Array', 'Authentication', 'Authorization', 'Assertion', 'Breakpoint', 'Boolean',
 'DNS', 'Docker', 'Environment variable', 'Exception', 'FIFO', 'Flexbox', 'Function',
 'Git', 'HTTP', 'HTTPS', 'Hot reload', 'JavaScript', 'Java', 'JOIN', 'JSDoc',
 'Kotlin', 'KISS', 'Kebab-case', 'Linter', 'Map', 'Mock', 'Null', 'NaN', 'npm',
 'Object', 'Open source', 'Parameter', 'Python', 'Pull request', 'Queue',
 'Recursion', 'Regex', 'Set', 'SQL', 'SSH',
 'TypeScript', 'TCP', 'URL', 'UI', 'UPDATE', 'Undo', 'Variable', 'VARCHAR',
 'While', 'WHERE', 'Webhook', 'YAML', 'Yarn', 'Y2K bug', 'ZIP', 'Zsh',
]);
const hardAnswers = new Set([
 'Amortized analysis', 'Backpressure', 'Bloom filter', 'Compare-and-swap',
 'Data race', 'Dijkstra', 'Event sourcing', 'Eventual consistency',
 'Head-of-line blocking', 'HMAC', 'Kruskal\'s algorithm', 'Kahn\'s algorithm',
 'KMP', 'Livelock', 'Mutex', 'Optimistic locking', 'Race condition', 'Raft',
 'Snapshot isolation', 'Topological sort', 'Trie', 'Write-ahead logging',
 'Y-combinator', 'Zero-copy', 'ZooKeeper',
]);

export const questionPool = [
 ...questions,
 ...Object.entries(questionVariants).flatMap(([letter, rows]) => rows.trim().split('\n').map((row, index) => {
  const [category, answer, text, explanation] = row.split('|');
  const difficulty = easyAnswers.has(answer) ? 'Kolay' : hardAnswers.has(answer) ? 'Zor' : 'Orta';
  return { ...make(letter, category, text, answer, explanation, difficulty), id: `${letter}-${index + 1}` };
 })),
];
