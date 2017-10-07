import { Router } from 'express';
const router = new Router();

router.use(function (req, res, next) {
  console.log('>>>> api_routes > router.use > req.method: ', req.method);
  console.log('>>>> api_routes > router.use > req.url: ', req.url);
  next();
})

/*
import routes123Routes from './routes123.routes';
import routesZYXRoutes from './routesZYX.routes';

router.use('/', routes123);

router.use('/', routesZYX);

router
  .route('/route/:routeId/id')
  .get();

router
  .route('/route/:routeId/id')
  .get();

router
  .route('/route/:routeId/id')
  .post();

router
  .route('/route/:routeId/id')
  .put();

router
  .route('/route/:routeId/id')
  .delete();
*/

export default router;