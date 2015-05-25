Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function () { return Meteor.subscribe('prompts'); }
});

Router.route('/', {name: 'promptsList'});

Router.route('/prompts/:_id', {
    name: 'promptPage',
    data: function () { return Prompts.findOne(this.params._id); }
});

Router.route('/prompts/:_id/edit', {
    name: 'promptEdit',
    data: function () { return Prompts.findOne(this.params._id); }
});

Router.route('/prompts/:_id/play', {
    name: 'promptPlay',
    layoutTemplate: 'playLayout',
    waitOn: function () { return Meteor.subscribe('prompts'); },
    data: function () { return Prompts.findOne(this.params._id); }
});