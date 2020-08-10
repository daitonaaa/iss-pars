class Scraper {
  tasks = [];

  createFindLegalTask(payload) {
    const task = new LegalTask(this);
    this.tasks.push({ task, payload });
  }

  createFindFizTask(payload) {
    const task = new FizTask(this);
    this.tasks.push({ task, payload });
  }

  createOOOTask(payload) {
    const task = new OOOTask(this);
    this.tasks.push({ task, payload });
  }

  async exec() {
    const results = [];

    for (let { task, payload } of this.tasks) {
      const taskResults = await task.run(payload);
      results.push(taskResults);
    }

    return results;
  }
}

class Task {
  runner;
  constructor(runner) {
    this.runner = runner;
  }
}

class LegalTask extends Task {
  run(payload) {
    return new Promise(x => {
      setTimeout(() => {
        x(payload);
      }, 500);
    });
  }
}

class OOOTask extends Task {
  run(payload) {
    return new Promise(x => {
      setTimeout(() => {
        x(payload);
      }, 500);
    });
  }
}

class FizTask extends Task {
  run(payload) {
    return new Promise(x => {
      setTimeout(() => {
        this.runner.createFindLegalTask({ name: 'Legal' });
        this.runner.createOOOTask({ name: 'OOO' });
        x(payload);
      }, 500);
    });
  }
}


const runner = new Scraper();
runner.createFindFizTask({ name: 'Vasya' });
runner.exec().then(console.log);
