function allSettledInOrder(input) {
  const items = Array.from(input);
  const count = items.length;

  return new Promise((resolve, reject) => {
    if (count === 0) {
      resolve([]);
      return;
    }

    const values = new Array(count);
    let remaining = count;

    items.forEach((item, i) => {
      Promise.resolve(item).then(
        (value) => {
          values[i] = value;
          remaining -= 1;
          if (remaining === 0) resolve(values);
        },
        reject // the first rejection settles the outer promise
      );
    });
  });
}

// Quick demo
const a = Promise.resolve("Task 1 completed");
const b = new Promise((res) => setTimeout(() => res("Task 2 completed"), 500));
const c = "plain value, not a promise";

allSettledInOrder([a, b, c])
  .then((out) => console.log(out))
  .catch((err) => console.log("Error:", err));