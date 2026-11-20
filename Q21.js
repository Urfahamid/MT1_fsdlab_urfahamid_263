function runWithLimit(jobs, maxParallel = 2) {
  return new Promise((resolve, reject) => {
    const total = jobs.length;
    let nextId = 0;
    let active = 0;
    let done = 0;

    if (total === 0) return resolve();

    function launchMore() {
      while (active < maxParallel && nextId < total) {
        const id = nextId++;
        active++;
        console.log(`Task ${id + 1} started`);

        jobs[id]()
          .then(() => {
            console.log(`Task ${id + 1} finished`);
          })
          .catch((err) => {
            console.error(`Task ${id + 1} failed:`, err);
          })
          .finally(() => {
            active--;
            done++;
            if (done === total) {
              console.log("All tasks completed!");
              resolve();
            } else {
              launchMore();
            }
          });
      }
    }

    launchMore();
  });
}

// Helper to make a fake async job that takes `ms` milliseconds
const wait = (ms) => () => new Promise((res) => setTimeout(res, ms));

const jobs = [wait(2000), wait(1000), wait(1500), wait(1000), wait(2000)];

runWithLimit(jobs, 2);