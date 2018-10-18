export class App {

  configureRouter(config, router) {
    this.router = router;
    config.title = 'SSL Tool';
    config.map([
      { route: '', name: 'home', moduleId: 'index', title: 'HOME' },
      { route: '/logs', name: 'logs', moduleId: 'logs', title: 'LOGS' },
      { route: '/edit/:slug', name: 'edit', moduleId: 'edit', title: 'EDIT'}
    ]);
  }




}
