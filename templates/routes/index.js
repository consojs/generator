let {Annotation} = require('conso');

let {route, get} = Annotation;

@route('/')
class Index {

    @get('/')
    async homePage(ctx, next) {
        await ctx.render('index', {title: 'Conso'});
    }
}
