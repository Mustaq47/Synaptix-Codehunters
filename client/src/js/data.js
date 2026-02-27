/**
 * NEXUS ASSESS — Question Banks
 * Expanded question sets per language, per difficulty (10+ each).
 */

export const QB = {
    // ══════════════════════════════════════════════════════════
    //  JAVA
    // ══════════════════════════════════════════════════════════
    java: {
        easy: [
            { q: "Which keyword is used to define a class in Java?", options: ["class", "define", "object", "struct"], ans: 0, topic: "Syntax" },
            { q: "What is the default value of an int in Java?", options: ["null", "undefined", "0", "-1"], ans: 2, topic: "Data Types" },
            { q: "Which method is the entry point of a Java program?", options: ["start()", "run()", "main()", "init()"], ans: 2, topic: "Syntax" },
            { q: "What does 'System.out.println()' do?", options: ["Reads input", "Prints to console", "Creates a file", "Exits program"], ans: 1, topic: "I/O" },
            { q: "Which of these is NOT a primitive data type in Java?", options: ["int", "boolean", "String", "double"], ans: 2, topic: "Data Types" },
            { q: "What keyword is used to inherit a class in Java?", options: ["extends", "implements", "inherits", "super"], ans: 0, topic: "OOP" },
            { q: "What does the 'new' keyword do in Java?", options: ["Deletes an object", "Creates a new object on the heap", "Declares a variable", "Imports a library"], ans: 1, topic: "OOP" },
            { q: "Which access modifier makes a member accessible only within its own class?", options: ["public", "protected", "private", "default"], ans: 2, topic: "OOP" },
            { q: "What is the size of an int in Java?", options: ["16 bits", "32 bits", "64 bits", "Depends on platform"], ans: 1, topic: "Data Types" },
            { q: "Which Java keyword is used to prevent a class from being subclassed?", options: ["static", "abstract", "final", "sealed"], ans: 2, topic: "Keywords" },
        ],
        medium: [
            { q: "What is the difference between '==' and '.equals()' in Java?", options: ["No difference", "'==' compares references; .equals() compares content", "'==' compares content; .equals() compares references", "Both compare content"], ans: 1, topic: "OOP" },
            { q: "Which Java collection maintains insertion order and allows duplicates?", options: ["HashSet", "TreeSet", "ArrayList", "HashMap"], ans: 2, topic: "Collections" },
            { q: "What is method overloading in Java?", options: ["Extending a superclass method", "Multiple methods with same name but different parameters", "Overriding an interface method", "Calling a method recursively"], ans: 1, topic: "OOP" },
            { q: "What does the 'final' keyword do when applied to a variable?", options: ["Makes it static", "Makes it immutable after initialization", "Makes it private", "Deletes it after use"], ans: 1, topic: "Keywords" },
            { q: "Which interface must be implemented to sort a custom class in Java?", options: ["Sortable", "Orderable", "Comparable", "Serializable"], ans: 2, topic: "Collections" },
            { q: "What is a Java interface?", options: ["A class with private methods", "A blueprint with abstract methods and constants", "A concrete implementation", "A type of enum"], ans: 1, topic: "OOP" },
            { q: "What does 'try-with-resources' in Java do?", options: ["Retry failed operations", "Automatically close resources that implement AutoCloseable", "Declare multiple exceptions", "Handle null pointers"], ans: 1, topic: "Exceptions" },
            { q: "Which collection does NOT allow null keys?", options: ["HashMap", "LinkedHashMap", "TreeMap", "Hashtable"], ans: 3, topic: "Collections" },
            { q: "What is an anonymous class in Java?", options: ["A class with no methods", "A local class declared and instantiated in a single expression without a name", "A class inside another class", "A class with only static members"], ans: 1, topic: "OOP" },
            { q: "What does the 'static' keyword mean for a class method?", options: ["Method is private", "Method belongs to the class rather than any instance", "Method cannot be overridden", "Method is asynchronous"], ans: 1, topic: "Keywords" },
        ],
        hard: [
            { q: "What is the time complexity of HashMap.get() in average case?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], ans: 2, topic: "Collections" },
            { q: "What is a checked exception in Java?", options: ["An exception caught at compile time", "An exception the compiler forces you to handle or declare", "A NullPointerException", "A RuntimeException"], ans: 1, topic: "Exceptions" },
            { q: "What does the 'volatile' keyword guarantee in Java threading?", options: ["Thread safety via locking", "Visibility of changes across threads without caching", "Atomic operations", "Prevents deadlocks"], ans: 1, topic: "Concurrency" },
            { q: "What is the difference between an abstract class and an interface in Java 8+?", options: ["No difference", "Interfaces can have default methods; abstract classes can have constructors", "Abstract classes cannot have any implementation", "Interfaces support multiple inheritance; abstract classes do not"], ans: 1, topic: "OOP" },
            { q: "What is autoboxing in Java?", options: ["Automatic memory management", "Auto-conversion between primitive types and their wrapper objects", "Converting strings to numbers", "Automatic garbage collection"], ans: 1, topic: "Data Types" },
            { q: "What is the purpose of the 'synchronized' keyword in Java?", options: ["Makes a method faster", "Ensures only one thread executes a block at a time", "Prevents null pointer exceptions", "Makes a variable read-only"], ans: 1, topic: "Concurrency" },
            { q: "What is a functional interface in Java?", options: ["An interface with multiple abstract methods", "An interface with exactly one abstract method, usable with lambdas", "An interface that extends Runnable", "An interface with only default methods"], ans: 1, topic: "OOP" },
            { q: "What collection is best for O(log n) sorted retrieval?", options: ["ArrayList", "HashSet", "TreeMap", "LinkedList"], ans: 2, topic: "Collections" },
            { q: "What is 'method reference' syntax in Java?", options: ["A pointer to a method object", "A shorthand lambda referencing an existing method via ClassName::method", "A deprecated feature", "A way to call super class methods"], ans: 1, topic: "OOP" },
            { q: "What happens if you don't catch or declare a checked exception?", options: ["It is ignored", "It shows a runtime warning", "The program fails to compile", "It converts to an unchecked exception"], ans: 2, topic: "Exceptions" },
        ],
        expert: [
            { q: "What is the contract between hashCode() and equals() in Java?", options: ["They're independent", "If a.equals(b) is true, a.hashCode() must equal b.hashCode()", "If a.hashCode()==b.hashCode(), a.equals(b) must be true", "They must always return different values"], ans: 1, topic: "OOP", boss: true },
            { q: "What memory area in JVM stores class metadata?", options: ["Heap", "Stack", "Metaspace (PermGen in older JVMs)", "Code Cache"], ans: 2, topic: "JVM", boss: true },
            { q: "In Java, what is a 'happens-before' relationship?", options: ["A scheduling priority", "A guarantee that memory writes in one thread are visible to another specific thread", "A compile-time optimization", "A garbage collection trigger"], ans: 1, topic: "Concurrency", boss: true },
            { q: "What design pattern does Java's InputStream hierarchy exemplify?", options: ["Singleton", "Decorator", "Observer", "Factory"], ans: 1, topic: "Design Patterns", boss: true },
            { q: "What is the difference between ConcurrentHashMap and Collections.synchronizedMap()?", options: ["No difference", "ConcurrentHashMap uses segment-level locking for higher throughput; synchronizedMap locks the whole map", "synchronizedMap is faster", "ConcurrentHashMap doesn't allow null values"], ans: 1, topic: "Concurrency", boss: true },
            { q: "What does the G1 (Garbage First) GC prioritize?", options: ["Maximum throughput", "Predictable pause times with region-based collection", "Lowest memory usage", "Single-threaded collection"], ans: 1, topic: "JVM", boss: true },
        ],
    },

    // ══════════════════════════════════════════════════════════
    //  C
    // ══════════════════════════════════════════════════════════
    c: {
        easy: [
            { q: "What does 'printf' do in C?", options: ["Reads input", "Prints formatted output", "Allocates memory", "Creates a pointer"], ans: 1, topic: "I/O" },
            { q: "Which symbol is used to dereference a pointer in C?", options: ["&", "*", "->", "#"], ans: 1, topic: "Pointers" },
            { q: "What is the correct way to declare an integer variable in C?", options: ["integer x;", "var x;", "int x;", "num x;"], ans: 2, topic: "Syntax" },
            { q: "What does 'scanf' do in C?", options: ["Prints text", "Reads formatted input", "Scans files", "Allocates memory"], ans: 1, topic: "I/O" },
            { q: "Which operator is used to get the address of a variable in C?", options: ["*", "->", "&", "#"], ans: 2, topic: "Pointers" },
            { q: "What is the return type of the main() function in C?", options: ["void", "int", "char", "double"], ans: 1, topic: "Syntax" },
            { q: "Which header file is needed for printf and scanf?", options: ["stdlib.h", "string.h", "stdio.h", "math.h"], ans: 2, topic: "I/O" },
            { q: "How do you declare a constant in C?", options: ["let PI = 3.14;", "const float PI = 3.14;", "final float PI = 3.14;", "define PI 3.14"], ans: 1, topic: "Syntax" },
            { q: "What is the % operator in C?", options: ["Division", "Power", "Modulo (remainder)", "Logical AND"], ans: 2, topic: "Syntax" },
            { q: "What size (bytes) is a char in C?", options: ["2", "4", "1", "Depends on compiler"], ans: 2, topic: "Data Types" },
        ],
        medium: [
            { q: "What is a null pointer in C?", options: ["A pointer to zero memory address", "A pointer that holds no valid address (typically 0/NULL)", "An uninitialized pointer", "A pointer to a string"], ans: 1, topic: "Pointers" },
            { q: "What is the purpose of 'malloc' in C?", options: ["Free memory", "Dynamically allocate memory on the heap", "Declare a variable", "Copy memory blocks"], ans: 1, topic: "Memory" },
            { q: "What is the difference between 'struct' and 'union' in C?", options: ["No difference", "In a union all members share the same memory space; struct members have their own", "Structs are only for integers", "Unions support inheritance"], ans: 1, topic: "Structs" },
            { q: "What does '#include' do in C?", options: ["Defines a macro", "Inserts the contents of a file into the source code", "Creates a pointer", "Imports a class"], ans: 1, topic: "Preprocessor" },
            { q: "What is a segmentation fault in C?", options: ["Compilation error", "A program accessing memory it doesn't have permission to access", "Stack overflow", "Integer division by zero"], ans: 1, topic: "Memory" },
            { q: "What is a typedef in C?", options: ["Creates a new data type", "Creates an alias for an existing type", "Defines a macro", "Imports external functions"], ans: 1, topic: "Syntax" },
            { q: "What is the difference between ++i and i++ in C?", options: ["No difference", "++i increments before use; i++ increments after the current expression", "++i is faster", "i++ is only for pointers"], ans: 1, topic: "Operators" },
            { q: "What does 'break' do inside a for loop in C?", options: ["Restarts the loop", "Exits the nearest enclosing loop", "Skips to the next iteration", "Prevents compilation"], ans: 1, topic: "Syntax" },
            { q: "What is the difference between char *s and char s[] in C?", options: ["No difference", "char *s is a pointer to a string literal (read-only); char s[] is a modifiable array", "char s[] is on the heap", "char *s is always null"], ans: 1, topic: "Pointers" },
            { q: "What does 'free()' do in C?", options: ["Creates memory", "Releases heap memory allocated by malloc/calloc", "Clears a file", "Resets a variable"], ans: 1, topic: "Memory" },
        ],
        hard: [
            { q: "What is the difference between 'calloc' and 'malloc'?", options: ["No difference", "calloc initializes allocated memory to zero; malloc does not", "malloc is faster", "calloc works on the stack"], ans: 1, topic: "Memory" },
            { q: "What is a dangling pointer in C?", options: ["An uninitialized pointer", "A pointer that still points to memory that has been freed", "A null pointer", "A function pointer"], ans: 1, topic: "Pointers" },
            { q: "What does the 'static' keyword mean for a local variable in C?", options: ["It's shared across files", "Its value persists across function calls", "It cannot be modified", "It's stored on the heap"], ans: 1, topic: "Storage" },
            { q: "What is a function pointer in C and what is it used for?", options: ["A pointer that can't be modified", "A pointer storing the address of a function, enabling callbacks", "A macro", "A struct member"], ans: 1, topic: "Pointers" },
            { q: "What is 'undefined behavior' in C?", options: ["A compile error", "Behavior not defined by the C standard — the program can do anything", "A runtime warning", "A segfault"], ans: 1, topic: "Syntax" },
            { q: "What is the purpose of 'volatile' in C?", options: ["Makes a variable constant", "Tells the compiler the variable may change externally; prevents optimization", "Stores variable in register", "Makes it thread-safe"], ans: 1, topic: "Storage" },
            { q: "What is endianness in C memory layout?", options: ["A string encoding", "The order in which bytes of a multi-byte value are stored in memory", "A pointer alignment rule", "A garbage collection strategy"], ans: 1, topic: "Memory" },
            { q: "What is the effect of declaring a global variable as 'static' in C?", options: ["It persists across function calls", "It limits the variable's scope to the current file (translation unit)", "It makes it read-only", "It initializes it to null"], ans: 1, topic: "Storage" },
            { q: "What is pointer arithmetic in C?", options: ["Using pointers in mathematical expressions incorrectly", "Performing addition/subtraction on pointers, scaled by the pointed-to type size", "Comparing two pointers to different arrays", "Casting pointers between types"], ans: 1, topic: "Pointers" },
            { q: "What is the difference between stack and heap allocation in C?", options: ["No difference", "Stack memory is automatically managed and LIFO; heap requires manual management via malloc/free", "Heap is faster", "Stack is unlimited"], ans: 1, topic: "Memory" },
        ],
        expert: [
            { q: "What is the strict aliasing rule in C?", options: ["Pointers of different types may point to the same object", "The compiler assumes pointers of incompatible types do NOT alias, enabling optimizations", "All pointers must be aligned", "Macros cannot alias variables"], ans: 1, topic: "Syntax", boss: true },
            { q: "What happens when you dereference a NULL pointer in C?", options: ["Returns 0", "Undefined behavior — typically a segmentation fault", "Returns garbage", "Causes a compile error"], ans: 1, topic: "Pointers", boss: true },
            { q: "What is the 'restrict' keyword in C99?", options: ["Prevents pointer modification", "A hint that no other pointer aliases the pointed-to object, enabling optimization", "Limits type casting", "Makes a pointer const"], ans: 1, topic: "Pointers", boss: true },
            { q: "How does longjmp/setjmp work in C?", options: ["Similar to try/catch", "Provides non-local jumps, bypassing the normal call stack by saving/restoring context", "Allocates memory in C99", "Creates function pointers"], ans: 1, topic: "Syntax", boss: true },
            { q: "What is memory alignment in C and why does it matter?", options: ["Sorting memory addresses", "Data objects placed at specific addresses that match their type size, required by CPU for correct/fast access", "Memory compression technique", "Garbage collection strategy"], ans: 1, topic: "Memory", boss: true },
        ],
    },

    // ══════════════════════════════════════════════════════════
    //  PYTHON
    // ══════════════════════════════════════════════════════════
    python: {
        easy: [
            { q: "What is the output of print(type(3.14))?", options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"], ans: 1, topic: "Data Types" },
            { q: "Which keyword defines a function in Python?", options: ["function", "def", "fun", "define"], ans: 1, topic: "Syntax" },
            { q: "How do you create a list in Python?", options: ["{1,2,3}", "(1,2,3)", "[1,2,3]", "<1,2,3>"], ans: 2, topic: "Data Structures" },
            { q: "Which of these is a mutable data type in Python?", options: ["tuple", "str", "frozenset", "list"], ans: 3, topic: "Data Types" },
            { q: "What does 'len([1,2,3])' return?", options: ["2", "3", "4", "Error"], ans: 1, topic: "Data Structures" },
            { q: "How do you start a comment in Python?", options: ["//", "/*", "#", "--"], ans: 2, topic: "Syntax" },
            { q: "What is the output of 10 // 3 in Python?", options: ["3.33", "3", "4", "1"], ans: 1, topic: "Operators" },
            { q: "What is the Python keyword for 'not equal'?", options: ["<>", "!=", "=/=", "not equals"], ans: 1, topic: "Operators" },
            { q: "Which data structure maps keys to values in Python?", options: ["list", "tuple", "set", "dict"], ans: 3, topic: "Data Structures" },
            { q: "How do you get the last element of a list 'arr' in Python?", options: ["arr.last()", "arr[-1]", "arr[end]", "arr.get(-1)"], ans: 1, topic: "Data Structures" },
        ],
        medium: [
            { q: "What is the difference between a list and a tuple in Python?", options: ["No difference", "Lists are mutable; tuples are immutable", "Tuples allow duplicates; lists don't", "Lists are faster to access"], ans: 1, topic: "Data Types" },
            { q: "What is a Python generator?", options: ["A function that creates lists", "A function that yields values lazily one at a time using 'yield'", "A class for creating objects", "A built-in sorting function"], ans: 1, topic: "Functions" },
            { q: "What does 'list comprehension' do in Python?", options: ["Deletes list elements", "Creates a new list by applying an expression to each element of an iterable", "Sorts a list in place", "Copies a list deeply"], ans: 1, topic: "Data Structures" },
            { q: "What is the difference between 'is' and '==' in Python?", options: ["No difference", "'is' checks identity (same object in memory); '==' checks equality of values", "'is' is faster", "'==' checks identity"], ans: 1, topic: "Operators" },
            { q: "What does *args do in a Python function?", options: ["Forces keyword-only arguments", "Accepts arbitrary positional arguments as a tuple", "Unpacks a dictionary", "Marks arguments as optional"], ans: 1, topic: "Functions" },
            { q: "What is a Python decorator?", options: ["A CSS-like styling feature", "A function that wraps another function to extend its behavior", "A class attribute", "A module import statement"], ans: 1, topic: "Functions" },
            { q: "What is the difference between deepcopy and copy in Python?", options: ["No difference", "deepcopy creates independent copies of nested objects; copy creates a shallow copy", "deepcopy only works on lists", "copy is slower"], ans: 1, topic: "Memory (Python)" },
            { q: "What is the GIL in Python?", options: ["A type of GUI library", "Global Interpreter Lock — prevents multiple threads from executing Python bytecode simultaneously", "Global Index List", "A garbage collection algorithm"], ans: 1, topic: "Internals" },
            { q: "What does **kwargs mean in Python?", options: ["Accepts arbitrary keyword arguments as a dict", "Arbitrary positional args", "Marks function as asynchronous", "Prevents function from being called"], ans: 0, topic: "Functions" },
            { q: "What is slicing in Python? For list=[0,1,2,3,4], what is list[1:3]?", options: ["[0,1,2]", "[1,2]", "[1,2,3]", "[2,3]"], ans: 1, topic: "Data Structures" },
        ],
        hard: [
            { q: "What is the time complexity of Python dict lookup?", options: ["O(n)", "O(log n)", "O(1) average", "O(n²)"], ans: 2, topic: "Data Structures" },
            { q: "What is a metaclass in Python?", options: ["A parent class", "The class of a class — defines how classes themselves are created", "A virtual class", "A mixin class"], ans: 1, topic: "OOP" },
            { q: "What is the difference between @staticmethod and @classmethod in Python?", options: ["No difference", "@staticmethod receives no automatic first arg; @classmethod receives cls as first arg", "@classmethod is faster", "@staticmethod is deprecated"], ans: 1, topic: "OOP" },
            { q: "What are Python slots (__slots__)?", options: ["Named tuples", "A way to restrict instance attributes and reduce memory usage by avoiding per-instance __dict__", "An abstract method decorator", "A tuple of class parents"], ans: 1, topic: "Memory (Python)" },
            { q: "What is a context manager in Python?", options: ["A threading tool", "An object implementing __enter__/__exit__ for resource management with 'with' statements", "A type of generator", "A logging module feature"], ans: 1, topic: "Functions" },
            { q: "What is Python's reference counting and when does it fail?", options: ["A garbage collector algorithm that always works", "Tracking object references to free memory when count hits 0; fails with circular references", "A type-checking system", "A way to count function calls"], ans: 1, topic: "Internals" },
            { q: "What is a coroutine in Python?", options: ["A recursive function", "A function defined with 'async def' that can be suspended with 'await', enabling cooperative multitasking", "A multiprocessing primitive", "A decorator pattern"], ans: 1, topic: "Functions" },
            { q: "What does Python's 'super()' call do?", options: ["Calls the current class constructor", "Returns a proxy object that delegates method calls to the parent class in the MRO", "Bypasses all inheritance", "Calls all parent classes simultaneously"], ans: 1, topic: "OOP" },
            { q: "What is the MRO (Method Resolution Order) in Python?", options: ["Memory Registration Order", "The order Python searches class hierarchy for methods using the C3 linearization algorithm", "A module reference optimization", "A type of metaclass"], ans: 1, topic: "OOP" },
            { q: "What is the difference between multiprocessing and threading in Python?", options: ["No difference", "Multiprocessing uses separate processes (bypassing GIL); threading uses OS threads limited by GIL", "Threading is always faster", "Multiprocessing shares memory"], ans: 1, topic: "Internals" },
        ],
        expert: [
            { q: "What is Python's descriptor protocol?", options: ["A file access protocol", "Objects implementing __get__, __set__, or __delete__ that control attribute access on other objects", "A serialization method", "A package installer"], ans: 1, topic: "OOP", boss: true },
            { q: "What is the difference between __new__ and __init__ in Python?", options: ["No difference", "__new__ creates the instance (allocates memory); __init__ initializes it", "__init__ creates the instance", "__new__ is deprecated"], ans: 1, topic: "OOP", boss: true },
            { q: "What is the purpose of 'yield from' in Python generators?", options: ["A new function definition", "Delegates to a sub-generator, yielding all its values and propagating send/throw", "Closes a generator", "Converts generator to list"], ans: 1, topic: "Functions", boss: true },
            { q: "What is a Python abstract base class (ABC)?", options: ["A class with no methods", "A class using ABCMeta that defines an interface — subclasses must implement abstract methods", "A built-in class", "A class with static-only methods"], ans: 1, topic: "OOP", boss: true },
            { q: "What does Python's asyncio event loop do?", options: ["Creates threads", "Manages and runs coroutines cooperatively on a single thread", "A multi-process scheduler", "A garbage collector"], ans: 1, topic: "Internals", boss: true },
        ],
    },
};
