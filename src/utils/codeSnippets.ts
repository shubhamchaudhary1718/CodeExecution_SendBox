export interface CodeSnippet {
  id: string;
  name: string;
  description: string;
  category: 'math' | 'string' | 'array' | 'algorithm' | 'utility';
  code: string;
}

export const snippets: CodeSnippet[] = [
  // Basic arithmetic operations
  {
    id: "add-two-numbers",
    name: "Add two numbers",
    description: "Function to add two numbers and return the result",
    category: "math",
    code: `// Function to add two numbers
function addNumbers(a, b) {
  return a + b;
}

// Example usage
const num1 = 5;
const num2 = 10;
const sum = addNumbers(num1, num2);
console.log(\`The sum of \${num1} and \${num2} is \${sum}\`);
`
  },
  {
    id: "subtract-two-numbers",
    name: "Subtract two numbers",
    description: "Function to subtract two numbers and return the result",
    category: "math",
    code: `// Function to subtract two numbers
function subtractNumbers(a, b) {
  return a - b;
}

// Example usage
const num1 = 20;
const num2 = 7;
const difference = subtractNumbers(num1, num2);
console.log(\`The difference between \${num1} and \${num2} is \${difference}\`);
`
  },
  {
    id: "multiply-two-numbers",
    name: "Multiply two numbers",
    description: "Function to multiply two numbers and return the result",
    category: "math",
    code: `// Function to multiply two numbers
function multiplyNumbers(a, b) {
  return a * b;
}

// Example usage
const num1 = 6;
const num2 = 8;
const product = multiplyNumbers(num1, num2);
console.log(\`The product of \${num1} and \${num2} is \${product}\`);
`
  },
  {
    id: "divide-two-numbers",
    name: "Divide two numbers",
    description: "Function to divide two numbers and return the result",
    category: "math",
    code: `// Function to divide two numbers
function divideNumbers(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

// Example usage
const num1 = 24;
const num2 = 6;
try {
  const quotient = divideNumbers(num1, num2);
  console.log(\`\${num1} divided by \${num2} equals \${quotient}\`);
} catch (error) {
  console.error(error.message);
}
`
  },
  
  // Factorial implementations
  {
    id: "factorial-recursive",
    name: "Factorial (Recursive)",
    description: "Calculate factorial using recursion",
    category: "math",
    code: `// Recursive function to calculate factorial
function factorial(n) {
  // Base case: factorial of 0 or 1 is 1
  if (n <= 1) {
    return 1;
  }
  
  // Recursive case: n! = n * (n-1)!
  return n * factorial(n - 1);
}

// Example usage
const number = 5;
const result = factorial(number);
console.log(\`The factorial of \${number} is \${result}\`);
`
  },
  {
    id: "factorial-iterative",
    name: "Factorial (Iterative)",
    description: "Calculate factorial using a for loop",
    category: "math",
    code: `// Iterative function to calculate factorial
function factorial(n) {
  // Handle edge cases
  if (n < 0) {
    throw new Error("Factorial is not defined for negative numbers");
  }
  
  // Base case: factorial of 0 or 1 is 1
  if (n <= 1) {
    return 1;
  }
  
  // Calculate factorial using a for loop
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  
  return result;
}

// Example usage
const number = 5;
try {
  const result = factorial(number);
  console.log(\`The factorial of \${number} is \${result}\`);
} catch (error) {
  console.error(error.message);
}
`
  },
  
  // Fibonacci implementations
  {
    id: "fibonacci-recursive",
    name: "Fibonacci (Recursive)",
    description: "Generate Fibonacci numbers using recursion",
    category: "math",
    code: `// Recursive function to calculate the nth Fibonacci number
function fibonacci(n) {
  // Base cases: F(0) = 0, F(1) = 1
  if (n <= 0) {
    return 0;
  } else if (n === 1) {
    return 1;
  }
  
  // Recursive case: F(n) = F(n-1) + F(n-2)
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
const n = 10;
console.log(\`The \${n}th Fibonacci number is \${fibonacci(n)}\`);

// Print the Fibonacci sequence up to the 10th number
console.log("Fibonacci sequence:");
for (let i = 0; i <= n; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}
`
  },
  {
    id: "fibonacci-iterative",
    name: "Fibonacci (Iterative)",
    description: "Generate Fibonacci numbers using iteration",
    category: "math",
    code: `// Iterative function to calculate the nth Fibonacci number
function fibonacci(n) {
  // Handle edge case
  if (n <= 0) {
    return 0;
  }
  
  // Initialize the first two Fibonacci numbers
  let a = 0;
  let b = 1;
  
  // Handle the case when n = 1
  if (n === 1) {
    return b;
  }
  
  // Calculate Fibonacci number using iteration
  let temp;
  for (let i = 2; i <= n; i++) {
    temp = a + b;
    a = b;
    b = temp;
  }
  
  return b;
}

// Example usage
const n = 10;
console.log(\`The \${n}th Fibonacci number is \${fibonacci(n)}\`);

// Print the Fibonacci sequence up to the 10th number
console.log("Fibonacci sequence:");
for (let i = 0; i <= n; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}
`
  },
  {
    id: "fibonacci-memoized",
    name: "Fibonacci (Memoized)",
    description: "Generate Fibonacci numbers using memoization",
    category: "math",
    code: `// Memoized function to calculate Fibonacci numbers efficiently
function fibonacciMemoized() {
  // Create a cache to store already calculated Fibonacci numbers
  const cache = {};
  
  function fib(n) {
    // Check if the result is already in the cache
    if (n in cache) {
      return cache[n];
    }
    
    // Base cases
    if (n <= 0) {
      return 0;
    } else if (n === 1) {
      return 1;
    }
    
    // Calculate and cache the result
    const result = fib(n - 1) + fib(n - 2);
    cache[n] = result;
    
    return result;
  }
  
  return fib;
}

// Create the memoized Fibonacci function
const fibonacci = fibonacciMemoized();

// Example usage
const n = 40; // Now we can efficiently calculate larger Fibonacci numbers
console.log(\`The \${n}th Fibonacci number is \${fibonacci(n)}\`);

// Print a few Fibonacci numbers
console.log("Fibonacci sequence (selected numbers):");
for (let i = 0; i <= 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}
console.log(\`F(20) = \${fibonacci(20)}\`);
console.log(\`F(30) = \${fibonacci(30)}\`);
console.log(\`F(40) = \${fibonacci(40)}\`);
`
  },
  
  // Prime number implementations
  {
    id: "prime-check",
    name: "Prime Number Check",
    description: "Check if a number is prime",
    category: "math",
    code: `// Function to check if a number is prime
function isPrime(number) {
  // Handle edge cases
  if (number <= 1) {
    return false;
  }
  
  if (number <= 3) {
    return true;
  }
  
  // Check if number is divisible by 2 or 3
  if (number % 2 === 0 || number % 3 === 0) {
    return false;
  }
  
  // Check all potential divisors up to the square root of the number
  // We only need to check numbers of the form 6k ± 1
  for (let i = 5; i * i <= number; i += 6) {
    if (number % i === 0 || number % (i + 2) === 0) {
      return false;
    }
  }
  
  return true;
}

// Example usage
const testNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 17, 19, 23, 29, 31];

for (const num of testNumbers) {
  console.log(\`\${num} is \${isPrime(num) ? 'prime' : 'not prime'}\`);
}
`
  },
  {
    id: "prime-sieve",
    name: "Sieve of Eratosthenes",
    description: "Find all prime numbers up to a given limit",
    category: "math",
    code: `// Function to find all prime numbers up to a given limit using the Sieve of Eratosthenes
function sieveOfEratosthenes(limit) {
  // Create a boolean array "isPrime[0..limit]" and initialize all entries as true
  const isPrime = new Array(limit + 1).fill(true);
  
  // 0 and 1 are not prime
  isPrime[0] = isPrime[1] = false;
  
  // Loop through all numbers from 2 to the square root of the limit
  for (let p = 2; p * p <= limit; p++) {
    // If isPrime[p] is not changed, then it is a prime
    if (isPrime[p]) {
      // Update all multiples of p
      for (let i = p * p; i <= limit; i += p) {
        isPrime[i] = false;
      }
    }
  }
  
  // Create an array to store all prime numbers
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }
  
  return primes;
}

// Example usage
const limit = 50;
const primeNumbers = sieveOfEratosthenes(limit);

console.log(\`Prime numbers up to \${limit}:\`);
console.log(primeNumbers.join(', '));
`
  },
  
  // Sorting algorithms
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    description: "Implement bubble sort algorithm",
    category: "algorithm",
    code: `// Bubble Sort Algorithm
function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  // Clone the array to avoid modifying the original
  const result = [...arr];
  
  // Traverse through all array elements
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    
    // Last i elements are already in place
    for (let j = 0; j < n - i - 1; j++) {
      // If current element is greater than the next element
      if (result[j] > result[j + 1]) {
        // Swap the elements
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred in this pass, the array is sorted
    if (!swapped) {
      break;
    }
  }
  
  return result;
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", array);
const sortedArray = bubbleSort(array);
console.log("Sorted array:", sortedArray);
`
  },
  {
    id: "selection-sort",
    name: "Selection Sort",
    description: "Implement selection sort algorithm",
    category: "algorithm",
    code: `// Selection Sort Algorithm
function selectionSort(arr) {
  const n = arr.length;
  
  // Clone the array to avoid modifying the original
  const result = [...arr];
  
  // One by one move boundary of unsorted subarray
  for (let i = 0; i < n - 1; i++) {
    // Find the minimum element in unsorted array
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (result[j] < result[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      [result[i], result[minIndex]] = [result[minIndex], result[i]];
    }
  }
  
  return result;
}

// Example usage
const array = [64, 25, 12, 22, 11];
console.log("Original array:", array);
const sortedArray = selectionSort(array);
console.log("Sorted array:", sortedArray);
`
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    description: "Implement merge sort algorithm",
    category: "algorithm",
    code: `// Merge Sort Algorithm
function mergeSort(arr) {
  // Base case: arrays with 0 or 1 elements are already sorted
  if (arr.length <= 1) {
    return arr;
  }
  
  // Split the array into two halves
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  
  // Recursively sort both halves
  return merge(mergeSort(left), mergeSort(right));
}

// Merge two sorted arrays
function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and add the smaller one to the result
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add any remaining elements from both arrays
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Example usage
const array = [38, 27, 43, 3, 9, 82, 10];
console.log("Original array:", array);
const sortedArray = mergeSort(array);
console.log("Sorted array:", sortedArray);
`
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    description: "Implement quick sort algorithm",
    category: "algorithm",
    code: `// Quick Sort Algorithm
function quickSort(arr) {
  // Clone the array to avoid modifying the original
  const result = [...arr];
  
  // Call the recursive helper function
  quickSortHelper(result, 0, result.length - 1);
  
  return result;
}

function quickSortHelper(arr, low, high) {
  if (low < high) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after the pivot
    quickSortHelper(arr, low, pivotIndex - 1);
    quickSortHelper(arr, pivotIndex + 1, high);
  }
}

function partition(arr, low, high) {
  // Choose the rightmost element as the pivot
  const pivot = arr[high];
  
  // Index of the smaller element
  let i = low - 1;
  
  // Traverse through all elements
  for (let j = low; j < high; j++) {
    // If current element is smaller than or equal to the pivot
    if (arr[j] <= pivot) {
      // Increment index of smaller element
      i++;
      // Swap elements
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Swap the pivot element with the element at (i + 1)
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  // Return the position of the pivot
  return i + 1;
}

// Example usage
const array = [10, 7, 8, 9, 1, 5];
console.log("Original array:", array);
const sortedArray = quickSort(array);
console.log("Sorted array:", sortedArray);
`
  },
  
  // String manipulation
  {
    id: "string-reverse",
    name: "Reverse a String",
    description: "Reverse a string using different methods",
    category: "string",
    code: `// Method 1: Using built-in methods
function reverseString1(str) {
  return str.split('').reverse().join('');
}

// Method 2: Using a for loop
function reverseString2(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Method 3: Using recursion
function reverseString3(str) {
  // Base case: empty string or single character
  if (str.length <= 1) {
    return str;
  }
  
  // Recursive case: first character goes to the end
  return reverseString3(str.substring(1)) + str[0];
}

// Method 4: Using array reduce
function reverseString4(str) {
  return [...str].reduce((acc, char) => char + acc, '');
}

// Example usage
const testString = "Hello, World!";
console.log("Original string:", testString);
console.log("Method 1 (built-in):", reverseString1(testString));
console.log("Method 2 (for loop):", reverseString2(testString));
console.log("Method 3 (recursion):", reverseString3(testString));
console.log("Method 4 (reduce):", reverseString4(testString));
`
  },
  {
    id: "palindrome-check",
    name: "Palindrome Check",
    description: "Check if a string is a palindrome",
    category: "string",
    code: `// Method 1: Using string reversal
function isPalindrome1(str) {
  // Normalize the string: remove non-alphanumeric characters and convert to lowercase
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Compare with its reverse
  const reversed = normalized.split('').reverse().join('');
  
  return normalized === reversed;
}

// Method 2: Using two pointers
function isPalindrome2(str) {
  // Normalize the string
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Set two pointers at the beginning and end of the string
  let left = 0;
  let right = normalized.length - 1;
  
  // Move pointers towards each other, comparing characters
  while (left < right) {
    if (normalized[left] !== normalized[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}

// Method 3: Using recursion
function isPalindrome3(str) {
  // Helper function for recursion with normalized string
  function isPalindromeHelper(normalized, start, end) {
    // Base case: empty string or single character
    if (start >= end) {
      return true;
    }
    
    // If characters don't match, it's not a palindrome
    if (normalized[start] !== normalized[end]) {
      return false;
    }
    
    // Recursive case: check the substring without the first and last characters
    return isPalindromeHelper(normalized, start + 1, end - 1);
  }
  
  // Normalize the string
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return isPalindromeHelper(normalized, 0, normalized.length - 1);
}

// Example usage
const testStrings = [
  "racecar",
  "A man, a plan, a canal: Panama",
  "hello",
  "Madam, I'm Adam.",
  "12321",
  "Not a palindrome"
];

console.log("Palindrome checks:");
testStrings.forEach(str => {
  console.log(\`"\${str}":\`);
  console.log(\`  Method 1 (reversal): \${isPalindrome1(str)}\`);
  console.log(\`  Method 2 (pointers): \${isPalindrome2(str)}\`);
  console.log(\`  Method 3 (recursion): \${isPalindrome3(str)}\`);
});
`
  },
  {
    id: "count-vowels",
    name: "Count Vowels",
    description: "Count the number of vowels in a string",
    category: "string",
    code: `// Method 1: Using a for loop
function countVowels1(str) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let count = 0;
  
  // Convert to lowercase for case-insensitive counting
  const lowerStr = str.toLowerCase();
  
  // Iterate through each character and check if it's a vowel
  for (let i = 0; i < lowerStr.length; i++) {
    if (vowels.includes(lowerStr[i])) {
      count++;
    }
  }
  
  return count;
}

// Method 2: Using regular expressions
function countVowels2(str) {
  // Match all vowels (case insensitive) and count them
  const matches = str.match(/[aeiou]/gi);
  
  // If no matches found, return 0
  return matches ? matches.length : 0;
}

// Method 3: Using array methods
function countVowels3(str) {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  
  // Convert string to array, filter vowels, and count
  return [...str.toLowerCase()].filter(char => vowels.has(char)).length;
}

// Example usage
const testStrings = [
  "Hello, World!",
  "JavaScript is awesome",
  "Rhythm", // No vowels
  "AEIOU", // All vowels
  "The quick brown fox jumps over the lazy dog"
];

console.log("Vowel counts:");
testStrings.forEach(str => {
  console.log(\`"\${str}":\`);
  console.log(\`  Method 1 (for loop): \${countVowels1(str)}\`);
  console.log(\`  Method 2 (regex): \${countVowels2(str)}\`);
  console.log(\`  Method 3 (array methods): \${countVowels3(str)}\`);
});
`
  },
  
  // Array operations
  {
    id: "array-sum",
    name: "Sum of Array Elements",
    description: "Calculate the sum of all elements in an array",
    category: "array",
    code: `// Method 1: Using a for loop
function sumArray1(arr) {
  let sum = 0;
  
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  
  return sum;
}

// Method 2: Using the reduce method
function sumArray2(arr) {
  return arr.reduce((sum, current) => sum + current, 0);
}

// Method 3: Using recursion
function sumArray3(arr) {
  // Base case: empty array
  if (arr.length === 0) {
    return 0;
  }
  
  // Recursive case: first element + sum of the rest
  return arr[0] + sumArray3(arr.slice(1));
}

// Method 4: Using forEach
function sumArray4(arr) {
  let sum = 0;
  arr.forEach(num => {
    sum += num;
  });
  return sum;
}

// Example usage
const arrays = [
  [1, 2, 3, 4, 5],
  [10, 20, 30],
  [-1, -2, 10],
  [0.5, 1.5, 2.5],
  [] // Empty array
];

console.log("Sum of array elements:");
arrays.forEach(arr => {
  console.log(\`Array: [\${arr}]\`);
  console.log(\`  Method 1 (for loop): \${sumArray1(arr)}\`);
  console.log(\`  Method 2 (reduce): \${sumArray2(arr)}\`);
  console.log(\`  Method 3 (recursion): \${sumArray3(arr)}\`);
  console.log(\`  Method 4 (forEach): \${sumArray4(arr)}\`);
});
`
  },
  {
    id: "find-largest",
    name: "Find Largest Element",
    description: "Find the largest element in an array",
    category: "array",
    code: `// Method 1: Using a for loop
function findLargest1(arr) {
  // Handle empty array
  if (arr.length === 0) {
    return null;
  }
  
  let largest = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > largest) {
      largest = arr[i];
    }
  }
  
  return largest;
}

// Method 2: Using Math.max with spread operator
function findLargest2(arr) {
  // Handle empty array
  if (arr.length === 0) {
    return null;
  }
  
  return Math.max(...arr);
}

// Method 3: Using the reduce method
function findLargest3(arr) {
  // Handle empty array
  if (arr.length === 0) {
    return null;
  }
  
  return arr.reduce((max, current) => (current > max ? current : max), arr[0]);
}

// Method 4: Using sort
function findLargest4(arr) {
  // Handle empty array
  if (arr.length === 0) {
    return null;
  }
  
  // Create a copy of the array to avoid modifying the original
  const sortedArr = [...arr].sort((a, b) => b - a);
  return sortedArr[0];
}

// Example usage
const arrays = [
  [1, 2, 3, 4, 5],
  [10, 20, 30, 5, 15],
  [-1, -5, -10],
  [7],
  [] // Empty array
];

console.log("Largest element in array:");
arrays.forEach(arr => {
  console.log(\`Array: [\${arr}]\`);
  console.log(\`  Method 1 (for loop): \${findLargest1(arr)}\`);
  console.log(\`  Method 2 (Math.max): \${findLargest2(arr)}\`);
  console.log(\`  Method 3 (reduce): \${findLargest3(arr)}\`);
  console.log(\`  Method 4 (sort): \${findLargest4(arr)}\`);
});
`
  },
  {
    id: "remove-duplicates",
    name: "Remove Duplicates",
    description: "Remove duplicate elements from an array",
    category: "array",
    code: `// Method 1: Using Set
function removeDuplicates1(arr) {
  return [...new Set(arr)];
}

// Method 2: Using filter
function removeDuplicates2(arr) {
  return arr.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
}

// Method 3: Using reduce
function removeDuplicates3(arr) {
  return arr.reduce((unique, item) => {
    return unique.includes(item) ? unique : [...unique, item];
  }, []);
}

// Method 4: Using forEach and object for tracking
function removeDuplicates4(arr) {
  const result = [];
  const seen = {};
  
  arr.forEach(item => {
    // Use a string representation as object keys
    const itemString = String(item);
    
    if (!seen[itemString]) {
      seen[itemString] = true;
      result.push(item);
    }
  });
  
  return result;
}

// Example usage
const arrays = [
  [1, 2, 2, 3, 4, 4, 5],
  [10, 20, 10, 30, 20, 40],
  ["a", "b", "a", "c", "b"],
  [true, false, true, true],
  [1, "1", true, 1, "1", true] // Mixed types
];

console.log("Remove duplicates from array:");
arrays.forEach(arr => {
  console.log(\`Array: [\${arr}]\`);
  console.log(\`  Method 1 (Set): \${JSON.stringify(removeDuplicates1(arr))}\`);
  console.log(\`  Method 2 (filter): \${JSON.stringify(removeDuplicates2(arr))}\`);
  console.log(\`  Method 3 (reduce): \${JSON.stringify(removeDuplicates3(arr))}\`);
  console.log(\`  Method 4 (forEach): \${JSON.stringify(removeDuplicates4(arr))}\`);
});
`
  },
  
  // Additional utility functions
  {
    id: "gcd-lcm",
    name: "GCD and LCM",
    description: "Calculate Greatest Common Divisor and Least Common Multiple",
    category: "math",
    code: `// Calculate GCD (Greatest Common Divisor) using Euclidean algorithm
function gcd(a, b) {
  // Ensure positive numbers
  a = Math.abs(a);
  b = Math.abs(b);
  
  // Base case
  if (b === 0) {
    return a;
  }
  
  // Recursive case
  return gcd(b, a % b);
}

// Calculate LCM (Least Common Multiple) using GCD
function lcm(a, b) {
  // Handle edge case: gcd could be zero if either a or b is zero
  if (a === 0 || b === 0) {
    return 0;
  }
  
  // LCM formula: |a * b| / gcd(a, b)
  return Math.abs(a * b) / gcd(a, b);
}

// Example usage
const testPairs = [
  [12, 18],
  [35, 49],
  [24, 36],
  [17, 23], // Coprime numbers
  [0, 5],
  [-12, 18]
];

console.log("GCD and LCM calculations:");
testPairs.forEach(([a, b]) => {
  console.log(\`Numbers: \${a} and \${b}\`);
  console.log(\`  GCD: \${gcd(a, b)}\`);
  console.log(\`  LCM: \${lcm(a, b)}\`);
});
`
  },
  {
    id: "random-number",
    name: "Random Number Generator",
    description: "Generate random numbers in different ranges",
    category: "utility",
    code: `// Generate a random number between 0 (inclusive) and 1 (exclusive)
function randomNumber() {
  return Math.random();
}

// Generate a random integer between min (inclusive) and max (inclusive)
function randomInt(min, max) {
  // Ensure min and max are integers
  min = Math.floor(min);
  max = Math.floor(max);
  
  // Handle invalid input
  if (min > max) {
    [min, max] = [max, min]; // Swap if min > max
  }
  
  // Formula: Math.floor(Math.random() * (max - min + 1)) + min
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random float between min (inclusive) and max (exclusive)
function randomFloat(min, max) {
  // Handle invalid input
  if (min > max) {
    [min, max] = [max, min]; // Swap if min > max
  }
  
  // Formula: Math.random() * (max - min) + min
  return Math.random() * (max - min) + min;
}

// Generate a random boolean with a specified probability of true
function randomBoolean(trueProbability = 0.5) {
  // Ensure probability is between 0 and 1
  trueProbability = Math.max(0, Math.min(1, trueProbability));
  
  return Math.random() < trueProbability;
}

// Generate a random item from an array
function randomItem(array) {
  if (array.length === 0) {
    return undefined;
  }
  
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

// Example usage
console.log("Random number generation:");
console.log(\`  Random number (0-1): \${randomNumber()}\`);
console.log(\`  Random integer (1-10): \${randomInt(1, 10)}\`);
console.log(\`  Random integer (1-100): \${randomInt(1, 100)}\`);
console.log(\`  Random float (0-10): \${randomFloat(0, 10).toFixed(2)}\`);
console.log(\`  Random boolean (default 50%): \${randomBoolean()}\`);
console.log(\`  Random boolean (75% true): \${randomBoolean(0.75)}\`);

const fruits = ["apple", "banana", "orange", "grape", "pineapple"];
console.log(\`  Random fruit from [\${fruits}]: \${randomItem(fruits)}\`);

// Generate 10 random integers between 1 and 100
console.log("10 random integers between 1 and 100:");
for (let i = 0; i < 10; i++) {
  console.log(\`  \${randomInt(1, 100)}\`);
}
`
  },
  {
    id: "anagram-check",
    name: "Anagram Check",
    description: "Check if two strings are anagrams of each other",
    category: "string",
    code: `// Method 1: Using sorting
function areAnagrams1(str1, str2) {
  // Remove non-alphanumeric characters and convert to lowercase
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const normalizedStr1 = normalize(str1);
  const normalizedStr2 = normalize(str2);
  
  // If the lengths are different, they can't be anagrams
  if (normalizedStr1.length !== normalizedStr2.length) {
    return false;
  }
  
  // Sort both strings and compare
  const sortedStr1 = [...normalizedStr1].sort().join('');
  const sortedStr2 = [...normalizedStr2].sort().join('');
  
  return sortedStr1 === sortedStr2;
}

// Method 2: Using character frequency counter
function areAnagrams2(str1, str2) {
  // Remove non-alphanumeric characters and convert to lowercase
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const normalizedStr1 = normalize(str1);
  const normalizedStr2 = normalize(str2);
  
  // If the lengths are different, they can't be anagrams
  if (normalizedStr1.length !== normalizedStr2.length) {
    return false;
  }
  
  // Count character frequencies in the first string
  const charCount = {};
  
  for (const char of normalizedStr1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  // Check if characters in the second string match the frequencies
  for (const char of normalizedStr2) {
    // If character doesn't exist or count is 0, not an anagram
    if (!charCount[char]) {
      return false;
    }
    
    charCount[char]--;
  }
  
  return true;
}

// Example usage
const testPairs = [
  ["listen", "silent"],
  ["debit card", "bad credit"],
  ["astronomer", "moon starer"],
  ["School master", "The classroom"],
  ["conversation", "voices rant on"],
  ["eleven plus two", "twelve plus one"],
  ["hello", "world"], // Not anagrams
  ["a", "a"],
  ["", ""] // Empty strings
];

console.log("Anagram checks:");
testPairs.forEach(([str1, str2]) => {
  console.log(\`Strings: "\${str1}" and "\${str2}"\`);
  console.log(\`  Method 1 (sorting): \${areAnagrams1(str1, str2)}\`);
  console.log(\`  Method 2 (frequency): \${areAnagrams2(str1, str2)}\`);
});
`
  },
  {
    id: "flatten-array",
    name: "Flatten Array",
    description: "Flatten a nested array structure",
    category: "array",
    code: `// Method 1: Using flat() method (ES2019+)
function flattenArray1(arr) {
  return arr.flat(Infinity);
}

// Method 2: Using recursion
function flattenArray2(arr) {
  let result = [];
  
  for (const item of arr) {
    if (Array.isArray(item)) {
      // Recursively flatten and concat the result
      result = result.concat(flattenArray2(item));
    } else {
      result.push(item);
    }
  }
  
  return result;
}

// Method 3: Using reduce
function flattenArray3(arr) {
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenArray3(item) : item);
  }, []);
}

// Method 4: Iterative approach using a stack
function flattenArray4(arr) {
  const result = [];
  const stack = [...arr];
  
  while (stack.length > 0) {
    const item = stack.pop();
    
    if (Array.isArray(item)) {
      // Push all elements of the nested array to the stack
      stack.push(...item);
    } else {
      result.unshift(item); // Add to the beginning to maintain order
    }
  }
  
  return result;
}

// Example usage
const nestedArrays = [
  [1, 2, [3, 4, [5, 6]]],
  [1, [2, 3], [4, [5, [6]]]],
  [[[[1, 2]]], 3, 4],
  [1, 2, 3, 4, 5], // Already flat
  [] // Empty array
];

console.log("Flatten nested arrays:");
nestedArrays.forEach(arr => {
  console.log(\`Array: \${JSON.stringify(arr)}\`);
  console.log(\`  Method 1 (flat): \${JSON.stringify(flattenArray1(arr))}\`);
  console.log(\`  Method 2 (recursion): \${JSON.stringify(flattenArray2(arr))}\`);
  console.log(\`  Method 3 (reduce): \${JSON.stringify(flattenArray3(arr))}\`);
  console.log(\`  Method 4 (stack): \${JSON.stringify(flattenArray4(arr))}\`);
});
`
  },
  {
    id: "object-utilities",
    name: "Object Utilities",
    description: "Utility functions for working with objects",
    category: "utility",
    code: `// Check if an object is empty
function isEmptyObject(obj) {
  // Check if it's an object first
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  
  return Object.keys(obj).length === 0;
}

// Deep clone an object
function deepClone(obj) {
  // Handle primitive types, null, and undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Handle Array objects
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  // Handle Object objects
  const clonedObj = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  
  return clonedObj;
}

// Merge two objects deeply
function deepMerge(target, source) {
  // Make a copy of the target to avoid modifying it
  const result = { ...target };
  
  // Handle if source is not an object
  if (source === null || typeof source !== 'object') {
    return result;
  }
  
  // Iterate through source properties
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      // If both values are objects, merge them recursively
      if (
        targetValue && typeof targetValue === 'object' &&
        sourceValue && typeof sourceValue === 'object' &&
        !Array.isArray(targetValue) && !Array.isArray(sourceValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        // Otherwise, use the source value
        result[key] = deepClone(sourceValue);
      }
    }
  }
  
  return result;
}

// Pick specific keys from an object
function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

// Omit specific keys from an object
function omit(obj, keys) {
  const result = { ...obj };
  
  keys.forEach(key => {
    delete result[key];
  });
  
  return result;
}

// Example usage
console.log("Object utilities examples:");

// Empty object check
const emptyObj = {};
const nonEmptyObj = { name: "John" };
console.log(\`  Is {} empty? \${isEmptyObject(emptyObj)}\`);
console.log(\`  Is { name: "John" } empty? \${isEmptyObject(nonEmptyObj)}\`);
console.log(\`  Is null empty? \${isEmptyObject(null)}\`);

// Deep clone
const original = { 
  name: "John", 
  age: 30, 
  address: { 
    city: "New York", 
    zip: "10001" 
  },
  hobbies: ["reading", "gaming"]
};
const clone = deepClone(original);
console.log(\`  Original object: \${JSON.stringify(original)}\`);
console.log(\`  Cloned object: \${JSON.stringify(clone)}\`);
console.log(\`  Are they the same reference? \${original === clone}\`);
console.log(\`  Is address the same reference? \${original.address === clone.address}\`);

// Deep merge
const target = { 
  name: "John", 
  age: 30, 
  address: { 
    city: "New York", 
    zip: "10001" 
  } 
};
const source = { 
  age: 31, 
  address: { 
    zip: "10002",
    country: "USA" 
  },
  phone: "123-456-7890"
};
console.log(\`  Target: \${JSON.stringify(target)}\`);
console.log(\`  Source: \${JSON.stringify(source)}\`);
console.log(\`  Merged: \${JSON.stringify(deepMerge(target, source))}\`);

// Pick & Omit
const person = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  phone: "123-456-7890",
  address: "123 Main St"
};
console.log(\`  Original: \${JSON.stringify(person)}\`);
console.log(\`  Pick (name, email): \${JSON.stringify(pick(person, ["name", "email"]))}\`);
console.log(\`  Omit (email, phone): \${JSON.stringify(omit(person, ["email", "phone"]))}\`);
`
  }
];
