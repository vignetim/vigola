// Each line gives the category, answer, clue, and explanation, in that order.
export const questionVariants = {
 A: `
Databases|Atomicity|A transaction writes three rows, but the last write fails. Which ACID property requires all three writes to succeed or none to take effect?|Atomicity makes a transaction an all-or-nothing unit.
JavaScript|Async/await|Which pair of JavaScript keywords lets you write Promise-based code in a style that resembles sequential statements?|An async function returns a Promise, and await suspends that function until a value settles.
Security|Authentication|A login system checks whether a password belongs to the claimed user. Which security process verifies that identity?|Authentication establishes who a user or system is.
Security|Authorization|A signed-in user can read a document but cannot delete it. Which security process decides these permissions?|Authorization determines which actions an identity is allowed to perform.
Software design|Adapter|A legacy payment client has the wrong interface for your application. Which design pattern wraps it in the expected interface?|An adapter translates between interfaces so existing components can work together.
Data structures|Array|You access a JavaScript collection with items[0] and items[1]. Which built-in indexed collection is this?|An array stores an ordered sequence of values accessed through indexes.
Compilers|Abstract syntax tree|A compiler turns source code into a hierarchy of nodes for expressions and statements. What is this representation called?|An abstract syntax tree captures program structure without every detail of the original syntax.
Testing|Assertion|A test compares an actual result with an expected value and fails when they differ. What is this check called?|An assertion expresses a condition that must hold for a test to pass.
Storage|Append-only log|A storage system records new events at the end of a sequence without changing earlier entries. What is this record called?|An append-only log preserves an ordered history by adding entries at the end.
Algorithms|Amortized analysis|An array resize is expensive, but many cheap appends make the average cost per operation small. Which analysis spreads cost over a sequence?|Amortized analysis bounds the total cost of a sequence rather than the worst cost of one operation.
`,
 B: `
Algorithms|Breadth-first search|In an unweighted graph, you explore every neighbor one edge away before visiting nodes two edges away. Which traversal is this?|Breadth-first search visits nodes by distance from the start, usually with a queue.
Concurrency|Backpressure|A consumer cannot keep up with incoming messages, so it signals the producer to slow down. What flow-control mechanism is this?|Backpressure limits production or delivery to match downstream capacity.
Delivery|Blue-green deployment|Two production environments exist; traffic switches from the old version to the fully prepared new one. What deployment strategy is this?|Blue-green deployment separates old and new versions so traffic can switch between them.
Data structures|Bloom filter|A membership check can say definitely absent or possibly present, but may return false positives. Which probabilistic structure is this?|A standard Bloom filter trades exact membership answers for compact storage without false negatives.
Developer tools|Breakpoint|You want a debugger to pause just before a suspicious line executes. What marker do you place there?|A breakpoint pauses execution so you can inspect state and step through the program.
Programming|Boolean|A flag can hold only true or false. What is its data type called?|Boolean values represent the two logical truth values.
Algorithms|Big O|Which notation describes an asymptotic upper bound, such as O(n), on how an algorithm's resource use grows?|Big O describes a growth-rate upper bound while ignoring constant factors.
Data processing|Batch processing|Instead of handling each record immediately, a job processes a collected group of records together. What approach is this?|Batch processing handles accumulated work as a group, often on a schedule.
Data structures|B-tree|A database index uses a balanced search tree whose nodes can hold many keys and children. Which tree family is this?|B-trees reduce tree height and suit storage systems that read data in blocks.
Networking|Buffer|A network receiver temporarily holds incoming bytes until the application is ready to consume them. What is this holding area called?|A buffer stores data temporarily between components working at different speeds.
`,
 C: `
JavaScript|Closure|A returned function still reads a local variable from its outer function after that outer call has finished. What enables this?|A closure preserves access to the lexical environment in which a function was created.
Reliability|Circuit breaker|After repeated failures, a service temporarily stops calling an unhealthy dependency and later probes for recovery. Which pattern is this?|A circuit breaker fails fast while a dependency recovers, reducing repeated failing calls.
Web security|CORS|A browser checks response headers before exposing an API response from a different origin. Which four-letter mechanism controls this access?|Cross-Origin Resource Sharing lets servers declare which origins may read responses in browsers.
Web security|CSRF|An attacker tricks a signed-in user's browser into submitting an unwanted authenticated request to another site. What attack is this?|Cross-Site Request Forgery abuses credentials that a browser attaches automatically.
Networking|CDN|Static assets are served from geographically distributed edge locations closer to users. What three-letter service architecture provides this?|A Content Delivery Network distributes cached content across edge servers.
Data integrity|Checksum|A downloader computes a small value from a file to detect accidental corruption. What is this integrity value generally called?|A checksum helps detect data changes; a basic checksum does not prove authenticity.
Software design|Composition|Instead of inheriting from a Logger class, a service holds a logger object and delegates to it. Which reuse technique is this?|Composition builds behavior by combining objects with separate responsibilities.
Databases|Connection pool|An application reuses a limited group of open database connections instead of opening one per request. What manages this group?|A connection pool lends existing connections to callers and accepts them back for reuse.
Concurrency|Compare-and-swap|A thread updates a shared value only if it still equals the value previously read. Which atomic operation supports this?|Compare-and-swap checks an expected value and conditionally replaces it as one atomic operation.
Delivery|Canary deployment|A new release first receives a small share of real traffic while the team watches for errors. Which rollout strategy is this?|A canary deployment limits initial exposure before expanding a release.
`,
 D: `
Web development|Debounce|A search box waits until the user stops typing for 300 milliseconds before sending a request. Which timing technique is this?|Debouncing delays work until calls have stopped for the configured interval.
Software design|Dependency injection|A service receives its database client through its constructor rather than creating the client itself. What technique is this?|Dependency injection supplies collaborators from outside a component.
Networking|DNS|A browser needs the IP address associated with a domain name before connecting. Which naming system resolves it?|The Domain Name System maps names to records such as IP addresses.
Infrastructure|Docker|A team builds an image from a Dockerfile and runs isolated containers from it. Which platform are they using?|Docker packages and runs applications as containers based on images.
Databases|Durability|A committed transaction must survive a database restart. Which ACID property provides this guarantee?|Durability means committed changes persist despite the failures covered by the database's guarantees.
Concurrency|Data race|Two threads access the same memory location without sufficient synchronization, and at least one writes. What concurrency defect is this?|A data race involves conflicting memory accesses without the required ordering or synchronization.
Algorithms|Dijkstra|You need shortest paths from one source in a weighted graph with no negative edge weights. Which classic algorithm fits?|Dijkstra's algorithm repeatedly settles the nearest unsettled vertex using nonnegative edge weights.
Databases|Denormalization|A team deliberately duplicates customer names in a reporting table to avoid joins. What schema technique is this?|Denormalization adds controlled redundancy to improve selected reads at a maintenance cost.
Developer tools|Diff|A review screen highlights added and removed lines between two file versions. What is this comparison called?|A diff represents differences between versions of content.
Programming|Duck typing|Code accepts any object with a callable write method, regardless of its declared class. What typing style is this?|Duck typing relies on supported behavior rather than an explicitly declared nominal type.
`,
 E: `
JavaScript|Event loop|After synchronous JavaScript finishes, queued callbacks get opportunities to run. What runtime mechanism coordinates this scheduling?|The event loop coordinates tasks with execution, while microtasks run at defined checkpoints.
Software architecture|Event sourcing|An account's state is rebuilt by replaying its stored deposits and withdrawals. Which persistence pattern stores changes this way?|Event sourcing records domain events as the source of truth rather than only storing current state.
Distributed systems|Eventual consistency|Replicas may briefly disagree, but should converge after updates stop and communication succeeds. Which consistency model is this?|Eventual consistency permits temporary divergence while requiring replicas to converge under its assumptions.
Reliability|Exponential backoff|Retries wait 1 second, then 2, then 4, then 8. What retry strategy increases delays this way?|Exponential backoff grows retry intervals multiplicatively; jitter can reduce synchronized retries.
Developer tools|Environment variable|A process reads its port from a named value supplied by the operating environment. What kind of setting is this?|An environment variable is a string setting inherited by a process from its environment.
Programming|Escape sequence|Inside a string literal, a backslash followed by n represents a newline. What is this character notation called?|An escape sequence represents a special character or interpretation inside a literal.
Programming|Eager evaluation|A language evaluates function arguments before entering the function, even when an argument is unused. What evaluation strategy is this?|Eager evaluation computes expressions immediately rather than delaying them until needed.
Programming|Exception|A failed operation throws a value that transfers control to a matching catch handler. What is that failure signal called?|An exception interrupts normal control flow and can be handled by surrounding code.
Systems|Endianness|Two machines store the bytes of the same multi-byte integer in opposite orders. What property differs between them?|Endianness describes byte order, such as little-endian and big-endian.
Data processing|ETL|A pipeline extracts source records, transforms them, and loads them into a warehouse. Which three-letter acronym describes it?|Extract, Transform, Load describes transforming data before loading it into a destination.
`,
 F: `
Databases|Foreign key|An orders table has a constraint requiring customer_id to reference an existing customer. What kind of key enforces this relationship?|A foreign key enforces referential integrity between related rows.
Data structures|FIFO|Jobs leave a queue in the same order they arrived. Which four-letter ordering rule is this?|First In, First Out serves the earliest enqueued item first.
Software design|Factory method|Which creational pattern lets subclasses decide which concrete object an overridable creation method returns?|The Factory Method pattern delegates concrete product creation through an overridable method.
Databases|Full-text search|A search engine uses indexed words, language rules, and relevance ranking rather than exact string equality. What search technique is this?|Full-text search indexes textual content to support term-based queries and relevance.
Web development|Flexbox|A CSS container arranges items along a main axis and distributes free space with justify-content. Which layout system is this?|Flexbox provides one-dimensional layout along a main axis and a cross axis.
Programming|Function|You wrap a reusable calculation in a named callable block that accepts arguments. What programming construct is this?|A function packages behavior that can be called with inputs and may return a result.
Testing|Fuzz testing|A test tool sends many generated, malformed inputs to a parser looking for crashes. What testing technique is this?|Fuzz testing explores input space with generated or mutated data to expose failures.
Reliability|Failover|A standby database takes over when the active database becomes unavailable. What is this transition called?|Failover transfers responsibility to a replacement component after a failure.
Operating systems|Fork|On Unix, which system call creates a child process from a running process?|fork creates a child with a separate process identity and a logically duplicated address space.
Programming|Functional programming|A codebase emphasizes pure functions, immutable data, and composing transformations. Which programming paradigm is this?|Functional programming organizes computation around functions and often minimizes mutable state.
`,
 G: `
Developer tools|Git|Your repository records snapshots in commits and allows local branches without a central server. Which version control system is this?|Git is a distributed version control system with local history and branching.
Data structures|Graph|You model cities as vertices and roads as edges. What general data structure represents these relationships?|A graph contains vertices connected by edges that may be directed or weighted.
Memory management|Garbage collection|A runtime automatically reclaims memory occupied by objects that are no longer reachable. What process is this?|Garbage collection frees memory that the program can no longer access through live references.
Algorithms|Greedy algorithm|At each step, an algorithm selects the locally best available choice without revisiting earlier choices. What approach is this?|A greedy algorithm makes local choices; optimality depends on the problem's structure.
Programming|Generics|A container is parameterized by a type T so the same implementation can hold different types safely. What feature enables this?|Generics express reusable algorithms and data structures with type parameters.
Reliability|Graceful shutdown|A server stops accepting new requests and finishes in-flight work before exiting. What shutdown approach is this?|Graceful shutdown gives ongoing work an opportunity to complete before resources are released.
Databases|GROUP BY|A SQL report needs one result row per country before calculating counts. Which clause forms these groups?|GROUP BY combines rows sharing grouping values so aggregate functions can operate on each group.
Data formats|Gzip|An HTTP response uses Content-Encoding: gzip. Which compression format has been applied?|Gzip compresses a byte stream and can reduce the size of transferred text.
Networking|gRPC|Two services communicate using .proto definitions and generated clients, commonly over HTTP/2. Which RPC framework is this?|gRPC defines service methods and messages and supports generated client and server code.
JavaScript|Generator|A JavaScript function declared with function* can pause and produce a sequence of values. What kind of function is it?|A generator returns an iterator whose execution can pause at yield expressions.
`,
 H: `
Networking|HTTP|A client sends GET /products and receives a status code, headers, and a body. Which application protocol defines this exchange?|Hypertext Transfer Protocol defines request and response semantics for web communication.
Networking|HTTPS|A browser uses HTTP over an encrypted TLS connection. What scheme names this protected form of web communication?|HTTPS protects HTTP traffic with TLS, providing confidentiality and integrity in transit.
Data structures|Hash collision|Two different keys produce the same hash value. What is this event called?|Hash collisions require a strategy that distinguishes keys sharing a hash or bucket.
Data structures|Heap|A priority queue uses a complete binary tree whose root holds the smallest item. Which data structure is this?|A min-heap keeps each parent no greater than its children; it does not fully sort all elements.
Security|HMAC|A sender combines a secret key with a cryptographic hash to authenticate a message. Which four-letter construction does this?|A Hash-based Message Authentication Code verifies integrity and authenticity for parties sharing a key.
Web development|Hydration|A browser attaches interactive behavior to HTML that was already rendered on the server. What is this process called?|Hydration connects client-side application logic to existing server-rendered markup.
Infrastructure|Horizontal scaling|A service gains capacity by adding more instances instead of increasing one machine's resources. What scaling approach is this?|Horizontal scaling distributes work across additional instances.
Distributed systems|Heartbeat|A worker periodically sends a small message to indicate it is still reachable. What is this liveness signal called?|A heartbeat helps detect possible failures, although a missed signal can also mean network delay.
Developer tools|Hot reload|You edit a component and the development environment updates the running application without a full manual restart. What feature is this?|Hot reload applies code changes during development, sometimes preserving application state.
Networking|Head-of-line blocking|A delayed item at the front of an ordered stream prevents later ready items from being delivered. What problem is this?|Head-of-line blocking couples later progress to completion of an earlier item.
`,
 I: `
Web development|Idempotency|Repeating an operation has the same intended effect on server state as performing it once. What property is this?|Idempotency concerns the resulting effect, even when individual responses differ.
Databases|Isolation|Concurrent transactions should not freely observe one another's incomplete changes. Which ACID property governs this interaction?|Isolation controls the visibility and interaction of concurrent transactions.
Software design|Inversion of control|A framework calls your registered application code instead of your code driving the framework's execution. What principle reverses control this way?|Inversion of control transfers responsibility for orchestration to another component or framework.
Programming|Immutable|Once a value is created, its contents cannot be changed. Which adjective describes it?|An immutable value is replaced with a new value rather than modified in place.
Programming|Inheritance|A subclass receives fields or methods from a parent class. What object-oriented mechanism enables this?|Inheritance derives a class from another class and can reuse or specialize behavior.
Testing|Integration test|A test checks that an API handler works with a real database rather than testing either part alone. What type of test is this?|Integration tests check interactions between components and their dependencies.
Programming|Iterator|An object exposes next() to produce successive values and signal when a sequence is finished. What traversal abstraction is this?|An iterator provides sequential access without requiring the caller to know the underlying representation.
Programming|Integer overflow|A fixed-width integer calculation exceeds its representable range. What condition has occurred?|Integer overflow may wrap, trap, or have other behavior depending on the language and operation.
Infrastructure|Infrastructure as code|A team describes networks and servers in versioned configuration files instead of setting them up manually. What practice is this?|Infrastructure as code makes infrastructure definitions reviewable and repeatable.
Performance|Invalidation|A product changes, so its cached representation must be marked unusable or removed. What cache-maintenance operation is this?|Invalidation prevents callers from continuing to use a cache entry known to be stale.
`,
 J: `
Databases|JOIN|A SQL query combines orders with matching customer rows using customer_id. Which operation connects the tables?|A JOIN combines rows from relations according to a matching condition.
Security|JWT|A signed token carries claims such as sub and exp, with header, payload, and signature segments separated by dots. Which three-letter token format is this?|A signed JSON Web Token carries claims; its payload is not encrypted by signing alone.
Programming|JavaScript|Which language runs browser scripts and uses undefined, const, and Promise as standard language features?|JavaScript supports dynamic values, functions, objects, and asynchronous programming.
Programming|Java|A program is compiled into bytecode and executed by a JVM. Which language, known for this execution model, is being used?|Java commonly targets JVM bytecode and provides a statically typed, class-based language.
Compilers|JIT compilation|A runtime compiles frequently executed code into machine code while the program is running. What compilation approach is this?|Just-In-Time compilation performs compilation during execution rather than entirely ahead of time.
Software architecture|Job queue|An API places email-sending work in a shared backlog for background workers. What structure holds the pending work?|A job queue decouples submitting background tasks from executing them.
Reliability|Jitter|Thousands of clients would retry at the same moment, so you add a random variation to each retry delay. What is this variation called?|Jitter spreads retries over time to reduce synchronized load spikes.
Data formats|JSON Pointer|Which standard syntax uses a path such as /users/0/name to identify a specific value inside a JSON document?|JSON Pointer identifies a value using slash-separated reference tokens.
Memory management|Java heap|In a JVM, which runtime memory area is shared by threads and holds class instances and arrays?|The Java heap stores objects and arrays and is managed by the JVM's garbage collector.
Developer tools|JSDoc|A JavaScript comment uses @param and @returns to describe a function. Which documentation convention is this?|JSDoc tags document JavaScript APIs and can also provide type information to development tools.
`,
 K: `
Databases|Key-value store|A database retrieves a complete value directly using a unique key rather than querying relational tables. What database model is this?|A key-value store associates each key with a value whose internal structure may be opaque to the store.
Programming|Kotlin|Which JVM language uses val and var and marks nullable types with a question-mark suffix?|Kotlin distinguishes nullable and non-nullable types in its type system.
Distributed systems|Kafka|A streaming platform organizes records into topics and partitions, with consumers tracking offsets. Which Apache project is this?|Apache Kafka provides partitioned event logs that consumers can read and replay.
Software design|KISS|A reviewer recommends the simplest design that solves the problem. Which acronym expresses the principle "Keep It Simple, Stupid"?|KISS favors understandable designs and avoids unnecessary complexity.
Algorithms|Kruskal's algorithm|To build a minimum spanning tree, you sort edges by weight and add each edge unless it creates a cycle. Which algorithm is this?|Kruskal's algorithm grows a minimum spanning forest, often using a disjoint-set structure.
Algorithms|Kahn's algorithm|A topological ordering is built by repeatedly removing vertices with zero incoming edges. Which algorithm uses this approach?|Kahn's algorithm tracks incoming-edge counts and detects a cycle if not every vertex can be removed.
Algorithms|KMP|Which three-letter string-matching algorithm uses a prefix table to avoid rechecking already matched characters?|Knuth-Morris-Pratt searches for a pattern in linear time using information about matching prefixes.
Security|Key derivation function|A password is processed with a salt and a work factor to produce cryptographic key material. What kind of function performs this?|A password-oriented key derivation function makes guessing more expensive through configurable computational cost.
Security|Kerberos|A client obtains tickets from a trusted distribution center to access network services. Which authentication protocol is this?|Kerberos uses tickets and shared-key cryptography to authenticate clients and services.
Naming conventions|Kebab-case|A URL slug uses the form account-settings, with lowercase words separated by hyphens. What naming convention is this?|Kebab-case separates words with hyphens.
`,
 L: `
Data structures|Linked list|Each node stores a value and a reference to the next node, without requiring contiguous storage. Which data structure is this?|A linked list connects nodes through references instead of indexing a contiguous array.
Performance|LRU|A full cache evicts the entry that has gone the longest without being accessed. Which three-letter policy is this?|Least Recently Used eviction prioritizes keeping entries that were accessed more recently.
Programming|Lazy evaluation|An expression is not computed until its result is actually needed. What evaluation strategy is this?|Lazy evaluation delays computation and may reuse a result once it has been evaluated.
JavaScript|Lexical scope|A function resolves variable names using where it was defined rather than where it was called. What scoping rule is this?|Lexical scope follows the nested structure of source code.
Developer tools|Linter|A tool flags unused imports and suspicious code patterns without running the application. What kind of tool is this?|A linter analyzes source code against rules that detect problems or enforce conventions.
Concurrency|Livelock|Two workers keep reacting to each other and changing state, but neither completes useful work. What concurrency problem is this?|In a livelock, participants remain active but fail to make progress.
Networking|Long polling|A server holds an HTTP request until an update arrives; the client then opens another request. What communication technique is this?|Long polling approximates server push by keeping each request pending until data or a timeout.
Databases|LEFT JOIN|A report must include every customer, even customers with no matching orders. Which SQL join keeps all rows from the left table?|A LEFT JOIN fills unmatched right-side columns with NULL.
Performance|Latency|A request takes 80 milliseconds from sending it to receiving its response. What performance measure describes this elapsed delay?|Latency measures delay; throughput measures how much work completes per unit of time.
Data structures|LIFO|You add A, then B, then C to a stack and remove C first. Which four-letter ordering rule explains this?|Last In, First Out removes the most recently added item first.
`,
 M: `
Concurrency|Mutex|Only one thread may enter a critical section at a time. Which mutual-exclusion locking primitive enforces this?|A mutex protects a resource by allowing one owner to hold the lock at a time.
Algorithms|Merge sort|An algorithm divides a sequence into halves, sorts them recursively, and combines the sorted halves. Which sorting algorithm is this?|Merge sort performs O(n log n) work and can be implemented as a stable sort.
Web development|Middleware|A request passes through shared logging and authentication handlers before reaching its route. What is this intermediate processing layer called?|Middleware runs reusable processing around requests, responses, or other operations.
Software architecture|Microservices|An application is split into small services that can be deployed independently and communicate over interfaces. What architectural style is this?|Microservices organize an application around independently deployable services with focused responsibilities.
Testing|Mock|A test double records calls so a test can verify that sendEmail was invoked with the expected arguments. What kind of test double is this?|A mock supports expectations about interactions, such as arguments and call counts.
JavaScript|Map|Which JavaScript collection stores key-value pairs and allows objects, not just strings or symbols, as keys?|A Map accepts keys of any type and iterates entries in insertion order.
Databases|Migration|A versioned script adds a column and records that the schema change has been applied. What is this change script called?|A migration moves a database schema or data from one known version to another.
Software architecture|Monolith|An application's modules are built and deployed together as one application unit. What architecture is this?|A monolith uses a single deployment unit, even when its internal code is modular.
Memory management|Memory leak|A server keeps references to unused objects, so its memory usage grows over time. What defect is this?|A memory leak retains memory that is no longer needed, preventing its reclamation.
Distributed systems|Message broker|Producers send messages to a central intermediary that routes them to consumers. What is this intermediary called?|A message broker decouples message producers from consumers and can provide buffering or routing.
`,
 N: `
JavaScript|Null|A JavaScript field deliberately contains the primitive value meaning no object value, distinct from undefined. Which value is this?|null is an explicit absence value; undefined commonly represents a missing or uninitialized value.
JavaScript|NaN|In JavaScript, Number("hello") produces which special numeric value?|NaN means Not-a-Number and is itself a value of the number type.
Programming|Namespace|Two libraries define the same class name, so their names are placed in separate named groups. What is this grouping mechanism called?|A namespace organizes names and helps prevent naming collisions.
Networking|NAT|A router rewrites packet address information as traffic crosses between private and public networks. Which three-letter technique is this?|Network Address Translation maps addresses, and often ports, between network address spaces.
Networking|NTP|Servers synchronize their clocks with network time sources. Which protocol commonly performs this synchronization?|Network Time Protocol estimates clock offsets while accounting for network delay.
Databases|Normalization|A schema separates repeated customer details into a customer table to reduce update anomalies. What design process is this?|Normalization organizes relations according to dependencies to reduce harmful redundancy.
Databases|N+1 query|A page loads one list of 50 orders, then makes one extra query per order for its customer. What query problem is this?|The N+1 query pattern performs a query for a collection plus separate queries for its members.
Developer tools|npm|Which JavaScript package manager uses commands such as npm install and reads dependencies from package.json?|npm installs packages and runs scripts defined in a project's package manifest.
Networking|Non-blocking I/O|A read operation returns without waiting for data, allowing the thread to continue other work. What I/O mode is this?|Non-blocking I/O reports readiness or a would-block result instead of suspending the caller until completion.
Security|Nonce|A protocol includes a fresh value intended for one-time use to help prevent replay. What is this value called?|A nonce must satisfy the protocol's uniqueness or freshness requirements.
`,
 O: `
Software design|Observer|An object notifies registered subscribers when its state changes without depending on their concrete classes. Which design pattern is this?|The Observer pattern connects a subject to subscribers through a notification interface.
Databases|ORM|A library maps database rows to application objects and translates object operations into queries. Which three-letter approach is this?|Object-Relational Mapping connects object models with relational data.
Programming|Overloading|A language allows several methods with the same name but different parameter signatures. What feature is this?|Overloading chooses among same-named callable definitions using their signatures.
Programming|Overriding|A subclass supplies its own implementation of a method inherited from its parent. What is this called?|Overriding specializes inherited behavior for the subclass.
Web security|Origin|A browser groups a URL by its scheme, host, and port for security decisions. What is this combination called?|An origin is determined by the scheme, host, and port, not the URL path.
Databases|ORDER BY|A SQL query must return the newest records first using created_at DESC. Which clause specifies this ordering?|ORDER BY defines the requested sorting of a query's result rows.
Algorithms|O(1)|A lookup performs a bounded amount of work regardless of how many items are stored. What notation describes constant time?|O(1) bounds the operation's work independently of input size under the stated model.
Networking|OSI|Which reference model separates networking into seven layers, from physical communication to applications?|The Open Systems Interconnection model is a seven-layer framework for describing network functions.
Databases|Optimistic locking|An update succeeds only if the row's version still matches the version read earlier. What concurrency-control technique is this?|Optimistic locking detects conflicting updates and typically requires a retry or conflict resolution.
Software licensing|Open source|Software is distributed under a license that allows use, inspection, modification, and redistribution of its source. What is this licensing model called?|Open-source licenses grant permissions beyond simply making source code visible.
`,
 P: `
JavaScript|Promise|A JavaScript function immediately returns an object representing a future result that can be pending, fulfilled, or rejected. What object is this?|A Promise represents the eventual outcome of an asynchronous operation.
Programming|Python|Which language uses indentation to define blocks and declares functions with def?|Python uses indentation as syntax for grouping statements into blocks.
Databases|Primary key|A table uses one column or a combination of columns to uniquely identify each row. What is this key called?|A primary key uniquely identifies rows and cannot contain NULL values.
Programming|Polymorphism|The same draw() call runs different implementations for Circle and Rectangle through a shared interface. What principle is this?|Polymorphism allows one interface to represent different concrete behaviors.
Data structures|Priority queue|A scheduler removes the most urgent pending task rather than the earliest arrival. Which abstract data type supports this?|A priority queue retrieves items according to priority, often using a heap.
Networking|Port|An IP address identifies the host; which number distinguishes a TCP or UDP service endpoint on that host?|A port number identifies a transport-layer endpoint within a host's network stack.
Compilers|Parser|After tokenization, a compiler checks grammar and builds a syntax structure. What component does this?|A parser organizes tokens according to a language's grammar.
Developer tools|Pull request|On GitHub, a developer opens a proposed branch change for discussion, checks, and code review. What is this proposal called?|A pull request brings a proposed change, review discussion, and automated checks together.
Programming|Parameter|In the declaration function greet(name), what is name called, as distinct from the argument supplied in a call?|A parameter is a named input in a callable definition; an argument is the supplied value.
Programming|Pure function|A function always returns the same output for the same inputs and has no observable side effects. What kind of function is this?|A pure function depends only on its inputs and does not modify external state.
`,
 R: `
Algorithms|Recursion|A function solves a problem by calling itself with a smaller input until a base case is reached. What technique is this?|Recursion reduces a problem through self-calls and needs a stopping condition.
Developer tools|Rebase|Git replays a branch's commits on top of a different base commit. Which operation is this?|Rebase creates a new sequence of commits based on another starting point.
Programming|Regex|You describe a text-matching pattern such as ^[0-9]+$ with a compact expression. What common short name describes this notation?|A regular expression defines a pattern for matching, searching, or replacing text.
Databases|Redis|Which in-memory data store offers strings, hashes, lists, and sets and is often used for caching?|Redis provides fast access to several data types and supports optional persistence.
Web development|REST|Which web architectural style uses resources, stateless interactions, and a uniform interface?|Representational State Transfer describes architectural constraints rather than a specific serialization format.
Concurrency|Race condition|A program's correctness unexpectedly depends on which concurrent operation happens first. What defect is this?|A race condition occurs when timing or ordering affects correctness without adequate coordination.
Programming|Rust|Which systems language uses ownership and borrowing to enforce memory-safety rules without requiring a garbage collector?|Rust checks ownership and borrowing rules during compilation for safe code.
Networking|Router|A device forwards IP packets between networks using a routing table. What kind of device is this?|A router chooses forwarding paths toward destination networks.
Reliability|Rate limiting|An API permits each client at most 100 requests per minute. What traffic-control technique is this?|Rate limiting bounds request volume over time to protect capacity or enforce usage policies.
Distributed systems|Raft|Which consensus algorithm organizes replicated logs around leader election, log replication, and majority agreement?|Raft aims to make consensus understandable through a leader-based replicated-log design.
`,
 S: `
Software design|Singleton|A class controls construction so callers share one instance through a common access point. Which design pattern is this?|The Singleton pattern restricts instantiation and supplies access to the shared instance.
Data structures|Set|You need a collection that retains each distinct value only once. Which collection type fits?|A set represents unique members and supports operations such as membership checks.
Data formats|Serialization|An application turns an in-memory object into JSON bytes for storage or transmission. What conversion process is this?|Serialization encodes structured values into a representation that can be stored or transferred.
Concurrency|Semaphore|A worker pool allows at most five tasks into a shared resource using a count of available permits. Which primitive is this?|A semaphore manages permits to limit concurrent access to a resource.
Networking|SSH|You open an encrypted remote terminal session using public-key authentication. Which protocol provides this?|Secure Shell supports authenticated, encrypted remote access and related services.
Databases|SQL|SELECT, INSERT, UPDATE, and DELETE belong to which language used with relational databases?|Structured Query Language defines operations for querying and changing relational data.
Databases|Snapshot isolation|A transaction reads from a consistent snapshot while concurrent committed updates may remain invisible to it. Which isolation approach is this?|Snapshot isolation provides snapshot reads but can still permit anomalies such as write skew.
Web development|Service worker|A browser runs a registered background script that can intercept network requests and serve cached responses. What is this script called?|A service worker can handle fetch events and support offline behavior without direct DOM access.
Distributed systems|Sharding|A large database splits different customers' rows across servers based on a partition key. What distribution technique is this?|Sharding partitions data across separate database nodes instead of copying all data to every node.
Security|Salt|Before hashing a password, a system adds a unique random value stored alongside the hash. What is this value called?|A salt makes identical passwords produce different derived values and weakens precomputed lookup attacks.
`,
 T: `
Networking|TCP|An application needs a reliable, ordered byte stream over IP. Which transport protocol provides it?|Transmission Control Protocol handles sequencing, retransmission, and flow control.
Security|TLS|Which protocol protects HTTPS traffic using encryption, integrity checks, and peer authentication?|Transport Layer Security protects data in transit between its connection endpoints.
Data structures|Trie|Autocomplete stores words along shared character prefixes in a tree. Which data structure is this?|A trie shares prefix paths and supports efficient prefix lookup.
Testing|TDD|A developer writes a failing test, makes it pass, and then refactors. Which three-letter development method uses this cycle?|Test-Driven Development follows a red, green, refactor cycle.
Programming|Tuple|A function returns a fixed sequence containing a status code and a message as one compound value. What structure commonly represents this?|A tuple groups an ordered collection of fields that may have different types.
Programming|TypeScript|Which language adds static type syntax and compile-time checking to JavaScript?|TypeScript checks types during development and removes type syntax when emitting JavaScript.
Performance|TTL|A cache entry expires after 60 seconds. Which three-letter setting describes its allowed lifetime?|Time To Live sets how long an entry remains valid under the cache policy.
Databases|Trigger|A database automatically runs configured logic when a row is inserted into a table. What database object enables this?|A trigger executes in response to specified database events.
Algorithms|Topological sort|Build tasks must be ordered so every dependency comes before the task that needs it. Which ordering of a directed acyclic graph solves this?|A topological sort places each directed edge's source before its destination.
Programming|Tail call|A function's final action is to return another function call's result without further work. What kind of call is this?|A tail call occurs in tail position and may allow stack-frame reuse when the runtime supports it.
`,
 U: `
Networking|UDP|A transport protocol sends datagrams without establishing a connection or guaranteeing delivery or order. Which protocol is this?|User Datagram Protocol provides datagrams with minimal transport-level guarantees.
Web development|URL|https://example.com/items?page=2 identifies where a resource can be accessed. What is this kind of locator called?|A Uniform Resource Locator includes components such as a scheme, host, path, and optional query.
Data formats|UTF-8|Which Unicode encoding represents ASCII characters with one byte and other code points with up to four bytes?|UTF-8 is a variable-length encoding compatible with ASCII byte values.
Data formats|Unicode|Which standard assigns code points to characters and symbols across writing systems?|Unicode defines characters and code points; encodings such as UTF-8 represent them as bytes.
Web development|UI|Buttons, forms, and menus make up the layer through which a user interacts with an application. What two-letter term describes it?|The User Interface presents information and controls for interacting with software.
Databases|UNION|You combine two compatible SELECT results and remove duplicate rows. Which SQL operator does this by default?|UNION eliminates duplicate rows, while UNION ALL preserves them.
Databases|UPDATE|Which SQL statement changes values in rows that already exist in a table?|UPDATE modifies existing rows; a WHERE clause can restrict which rows are changed.
Operating systems|Unix|Which operating-system family is associated with pipes, small composable tools, and a hierarchical filesystem?|Unix established operating-system interfaces and tool conventions used by many later systems.
Developer tools|Undo|An editor restores the state before your most recent edit. What command performs this action?|Undo walks backward through recorded editing actions.
Identifiers|UUID|Which 128-bit identifier family includes version 4 values generated from random or pseudorandom bits?|A Universally Unique Identifier is designed for uniqueness without requiring one central counter.
`,
 V: `
Web development|Virtual DOM|A UI library keeps an in-memory representation of a view and compares versions before updating the real DOM. What is this representation called?|A virtual DOM represents UI structure in memory and can support reconciliation.
JavaScript|V8|Which engine executes JavaScript in Chrome and Node.js?|V8 compiles and executes JavaScript and also supports WebAssembly.
Infrastructure|Virtual machine|A hypervisor gives a guest operating system its own virtual CPU, memory, and devices. What environment is this?|A virtual machine runs a guest system on virtualized hardware resources.
Web development|Vue|Which JavaScript UI framework uses .vue single-file components with template, script, and style sections?|Vue supports component-based interfaces and a reactive data model.
Databases|View|A database exposes a stored SELECT definition as a virtual table without necessarily storing its result rows. What object is this?|An ordinary view stores a query definition and presents its result as a relation.
Programming|Variable|A program associates a name with a value that can be read later, such as let count = 0. What is this named binding commonly called?|A variable provides access to a value according to the language's scope and assignment rules.
Networking|VPN|A remote laptop connects to a private network through an encrypted tunnel. Which three-letter technology enables this?|A Virtual Private Network extends private-network connectivity over another network.
Developer tools|Vite|Which frontend build tool takes its name from the French word for fast and provides a development server with hot module replacement?|Vite provides a development server and tooling for building production assets.
Databases|VARCHAR|Which common SQL column type stores character strings whose lengths can vary up to a declared limit?|VARCHAR represents variable-length character data, with exact limits depending on the database.
Distributed systems|Vector clock|Each node keeps a counter in a shared timestamp structure so events can be compared for causal order. What logical-clock structure is this?|Vector clocks can distinguish causal ordering from concurrency under their model.
`,
 W: `
Web development|WebAssembly|A browser loads a .wasm module compiled from C or Rust. Which portable instruction format is being executed?|WebAssembly is a binary instruction format designed as a compilation target for multiple languages.
Web development|Webhook|A payment service sends an HTTP request to your endpoint when a payment completes. What event-notification mechanism is this?|A webhook delivers an event notification to a configured HTTP endpoint.
Programming|While|Which loop keyword repeats a block for as long as a condition remains true, checking before each iteration?|A while loop evaluates its condition before running its body.
Databases|WHERE|A SQL query should return only rows whose status equals active. Which clause filters the rows?|WHERE selects rows whose condition evaluates to true before grouping.
Web development|Web Worker|A browser moves a CPU-heavy calculation to a separate JavaScript thread that communicates with the page through messages. Which API enables this?|A Web Worker runs outside the page's main thread and cannot directly manipulate its DOM.
Networking|WAN|A company connects office networks across several countries. Which three-letter network category describes this geographic scale?|A Wide Area Network connects networks over a large geographic area.
Developer tools|Webpack|Which module bundler builds a dependency graph and emits bundles using concepts such as loaders and plugins?|Webpack transforms and bundles modules and related assets based on a dependency graph.
Networking|Wi-Fi|A laptop joins a local wireless network based on IEEE 802.11. What common technology name describes this connection?|Wi-Fi provides wireless local-area networking using the IEEE 802.11 family.
Web development|WebRTC|A browser app needs real-time peer audio, video, and data channels. Which web technology provides these capabilities?|WebRTC supports peer communication and may use relay servers when direct connections are unavailable.
Databases|Write-ahead logging|Before modified database pages are persisted, their changes are recorded in a recovery log. What durability technique is this?|Write-ahead logging requires relevant log records to reach durable storage before corresponding data pages.
`,
 Y: `
JavaScript|Yield|Which keyword pauses a JavaScript generator and supplies a value to its caller?|yield suspends generator execution until the iterator is resumed.
Data formats|YAML|A configuration file describes mappings and sequences using indentation and key: value entries. Which format is this?|YAML is a human-readable data-serialization format commonly used for configuration.
Developer tools|Yarn|Which JavaScript package manager uses a yarn.lock file to record dependency resolutions?|Yarn manages project dependencies and records resolution information in its lockfile.
Compilers|Yacc|Which classic parser generator takes a grammar specification and produces a parser, with a name meaning Yet Another Compiler-Compiler?|Yacc generates parsers from grammar rules paired with semantic actions.
Programming|Yoda condition|A C-style comparison puts the constant first, as in 5 == count, to expose accidental assignment. What nickname describes this style?|A Yoda condition reverses the usual operand order so assignment to a literal would be invalid.
Systems|Year 2038 problem|A signed 32-bit Unix time counter overflows in January 2038. What is this time-representation problem called?|The Year 2038 problem affects systems representing Unix seconds in a signed 32-bit integer.
Systems|Y2K bug|Older software stores years with two digits and may interpret 00 as 1900 rather than 2000. What historical bug is this?|The Y2K bug arose from ambiguous or insufficient year representations near the millennium change.
Units|Yottabyte|Which decimal storage unit equals 10 to the power of 24 bytes and uses the symbol YB?|A yottabyte is 1,000 zettabytes; decimal units use powers of ten.
Digital media|YUV|Which three-letter color model names a luma component Y and two chrominance components U and V?|YUV separates brightness-related information from color-difference information in analog video.
Functional programming|Y-combinator|Which fixed-point combinator enables recursive definitions in untyped lambda calculus without a function naming itself?|The Y-combinator supplies a fixed point; practical strict languages need suitable evaluation handling or a variant.
`,
 Z: `
Web development|z-index|A positioned CSS element must appear above a sibling in the same stacking context. Which property controls this stacking order?|z-index orders elements within stacking contexts; a large value cannot escape a parent stacking context.
Data formats|ZIP|Which archive format groups files into one archive and commonly compresses each entry?|ZIP stores entries and metadata and supports several compression methods, including uncompressed storage.
Programming|Zig|Which systems language uses comptime for compile-time execution and supports manual memory management and C interoperability?|Zig provides explicit control over allocation and supports compile-time computation.
Security|Zero trust|A security model does not automatically trust a request just because it comes from inside the network. What is this model called?|Zero trust evaluates access using identity, context, and policy rather than network location alone.
Delivery|Zero downtime deployment|Users continue receiving service throughout a release rollout. What deployment goal describes this uninterrupted availability?|Zero downtime deployment aims to keep service available while software versions change.
Operating systems|Zombie process|A Unix child process has exited, but its parent has not collected its exit status. What is the remaining process-table entry called?|A zombie retains termination information until its parent or another responsible process reaps it.
Performance|Zero-copy|An I/O path avoids unnecessary copies between user-space and kernel buffers. What optimization technique is this?|Zero-copy techniques reduce copying overhead; the exact avoided copies depend on the system and API.
Developer tools|Zsh|Which Unix shell, also called the Z shell, is configured through a .zshrc file?|Zsh is an interactive command interpreter with scripting and completion features.
Compression|Zstandard|Which lossless compression algorithm is commonly abbreviated zstd and supports configurable compression levels?|Zstandard balances compression ratio and speed and can use dictionaries for suitable workloads.
Distributed systems|ZooKeeper|Which Apache coordination service exposes a hierarchical namespace of znodes for tasks such as configuration and leader coordination?|ZooKeeper provides coordination primitives built around ordered updates and a hierarchical data model.
`,
};
