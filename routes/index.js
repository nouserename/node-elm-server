'use strict';

import v1 from './v1'
import v2 from './v2'
import v4 from './v4'
import bos from './bos'
import eus from './eus'
import admin from './admin'
import payapi from './payapi'
import shopping from './shopping'

//对外以函数形式暴露，方便集中注册路由
export default app => {
    app.use('/v1', v1);
    app.use('/v2', v2);
    app.use('/v4', v4);
    app.use('/bos', bos);
    app.use('/eus', eus);
    app.use('/admin', admin);
    app.use('/payapi', payapi);
    app.use('/shopping', shopping);
}