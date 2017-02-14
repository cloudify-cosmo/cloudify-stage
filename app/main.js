/**
 * Created by kinneretzin on 24/01/2017.
 */

import app from './app';

app.load().then(app.initIfLoggedIn).then(app.start);
