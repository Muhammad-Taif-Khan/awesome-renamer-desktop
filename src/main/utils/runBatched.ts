function isTaskFunction<T>(
  task: T | PromiseLike<T> | (() => T | PromiseLike<T>)
): task is () => T | PromiseLike<T> {
  return typeof task === 'function';
}

export default async function runBatched<T>(tasks: ((() => Promise<T>) | Promise<T>)[], limit: number): Promise<Awaited<T>[]> {
  const result: Promise<T>[] = [];
  const executing = new Set<Promise<T>>();

  for (const task of tasks) {
    const _task = isTaskFunction(task) ? task() : task;
    const p = Promise.resolve(_task);
    result.push(p);
    executing.add(p);
    p.finally(() => executing.delete(p));
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(result);
}
